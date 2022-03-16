const { ObjectId } = require("mongodb");
const { ContentType, Day } = require("@subsquare/backend-common/constants");
const {
  PostTitleLengthLimitation,
} = require("@subsquare/backend-common/constants");
const {
  safeHtml,
  extractMentions,
} = require("@subsquare/backend-common/utils/post");
const {
  getDb: getBusinessDb,
  getDemocracyCollection,
  getMotionCollection,
  getCommentCollection,
  getReactionCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getExternalCollection: getChainExternalCollection,
  getPreImageCollection,
  getMotionCollection: getChainMotionCollection,
  getTechCommMotionCollection: getChainTechCommMotionCollection,
} = require("../mongo/chain");
const {
  getDb: getCommonDb,
  lookupUser,
  getUserByAddress,
  getUserCollection,
} = require("@subsquare/backend-common/mongo/common");
const { HttpError } = require("@subsquare/backend-common/exc");
const { toUserPublicInfo } = require("@subsquare/backend-common/utils/user");
const mailService = require("@subsquare/backend-common/services/mail.service");

async function findExternal(postId) {
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else {
    const m = postId.match(/^(\d+)_(.+)$/);
    if (m) {
      q["indexer.blockHeight"] = parseInt(m[1]);
      q.proposalHash = m[2];
    } else {
      q.proposalHash = postId;
    }
  }

  const chainExternalCol = await getChainExternalCollection();
  return await chainExternalCol.findOne(q, {
    sort: [["indexer.blockHeight", -1]],
  });
}

async function findExternalPost(chainExternal) {
  let postCol;
  let post;
  let postType;

  postCol = await getDemocracyCollection();
  post = await postCol.findOne(
    {
      externalProposalHash: chainExternal.proposalHash,
      "indexer.blockHeight": chainExternal.indexer.blockHeight,
    },
    {
      sort: { "indexer.blockHeight": -1 },
    }
  );
  postType = "democracy";

  // 当 Democracy post 没有编辑内容时，而且这个 External proposal 只关联了一个 motion，
  // 那么我们认为此关联的 Motion 创建了这个 External。
  //
  // 旧数据中，当 Democracy post 没有编辑内容，而 Motion post有内容时，使用 Motion post
  // 其他情况则使用 Democracy post
  if (!post.content && chainExternal.motions?.length === 1) {
    const hash = chainExternal.motions[0].hash;
    const height = chainExternal.motions[0].indexer.blockHeight;

    const motionCol = await getMotionCollection();
    const motionPost = await motionCol.findOne({ hash, height });
    if (motionPost && motionPost.content) {
      postCol = motionCol;
      post = motionPost;
      postType = "motion";
    }
  }

  return [postCol, post, postType];
}

async function loadPostForExternals(chainExternals) {
  const chain = process.env.CHAIN;

  for (const external of chainExternals) {
    if (external.motions?.length === 1) {
      external.motionHash = external.motions[0].hash;
      external.motionHeight = external.motions[0].indexer.blockHeight;
    }
  }

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();

  const [democracyPosts, motionPosts] = await Promise.all([
    businessDb.compoundLookupOne({
      from: "democracy",
      for: chainExternals,
      as: "democracyPost",
      compoundLocalFields: ["proposalHash", "indexer.blockHeight"],
      compoundForeignFields: ["externalProposalHash", "indexer.blockHeight"],
    }),
    businessDb.compoundLookupOne({
      from: "motion",
      for: chainExternals,
      as: "motionPost",
      compoundLocalFields: ["motionHash", "motionHeight"],
      compoundForeignFields: ["hash", "indexer.blockHeight"],
    }),
  ]);

  await Promise.all([
    businessDb.lookupCount({
      from: "comment",
      for: democracyPosts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "democracy",
    }),
    businessDb.lookupCount({
      from: "comment",
      for: motionPosts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "motion",
    }),
    commonDb.lookupOne(
      {
        from: "user",
        foreignField: `${chain}Address`,
        map: toUserPublicInfo,
      },
      [
        {
          for: democracyPosts,
          as: "author",
          localField: "proposer",
        },
        {
          for: motionPosts,
          as: "author",
          localField: "proposer",
        },
      ]
    ),
  ]);

  return chainExternals.map((item) => {
    const post = {
      ...(!item.democracyPost.content && item.motionPost?.content
        ? item.motionPost
        : item.democracyPost),
    };
    item.democracyPost = undefined;
    item.motionPost = undefined;
    post._id = item._id;
    post.externalProposalHash = item.proposalHash;
    post.indexer = item.indexer;
    post.onchainData = item;
    post.state = item.state?.state;
    return post;
  });
}

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;

  const chainExternal = await findExternal(postId);
  if (!chainExternal) {
    throw new HttpError(404, "Motion is not found");
  }

  const [postCol, post, postType] = await findExternalPost(chainExternal);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  if (!chainExternal) {
    throw new HttpError(404, "On-chain data is not found");
  }

  if (!chainExternal.authors.includes(author[`${chain}Address`])) {
    throw new HttpError(403, "You cannot edit");
  }

  if (title.length > PostTitleLengthLimitation) {
    throw new HttpError(400, {
      title: ["Title must be no more than %d characters"],
    });
  }

  const now = new Date();

  const result = await postCol.updateOne(
    { _id: post._id },
    {
      $set: {
        title,
        content: contentType === ContentType.Html ? safeHtml(content) : content,
        contentType,
        contentVersion: post.contentVersion ?? "2",
        updatedAt: now,
        lastActivityAt: now,
      },
    }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Failed to update post");
  }

  return true;
}

async function getActivePostsOverview() {
  const chainExternalCol = await getChainExternalCollection();
  const chainExternals = await chainExternalCol
    .find(
      {
        $or: [
          {
            "state.state": {
              $nin: [
                "Tabled",
                "ExternalTabled",
                "fastTrack",
                "Vetoed",
                "Overwritten",
              ],
            },
          },
          {
            "state.indexer.blockTime": {
              $gt: Date.now() - 3 * Day,
            },
          },
        ],
      },
      {
        projection: {
          timeline: 0,
        },
      }
    )
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  const result = await loadPostForExternals(chainExternals);

  return result;
}

async function getPostsByChain(page, pageSize) {
  const chainExternalCol = await getChainExternalCollection();
  const total = await chainExternalCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const chainExternals = await chainExternalCol
    .find({})
    .sort({ "indexer.blockHeight": -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const posts = await loadPostForExternals(chainExternals);

  return {
    items: posts,
    total,
    page,
    pageSize,
  };
}

async function getPostById(postId) {
  const chainExternal = await findExternal(postId);
  if (!chainExternal) {
    throw new HttpError(404, "External is not found");
  }

  const [postCol, post, postType] = await findExternalPost(chainExternal);
  if (!post) {
    throw new HttpError(404, "External does not exists");
  }

  const businessDb = await getBusinessDb();
  const preImageCol = await getPreImageCollection();
  const chainMotionCol = await getChainMotionCollection();
  const chainTechCommMotionCol = await getChainTechCommMotionCollection();

  const [author, reactions, preImage, motions, techCommMotions] =
    await Promise.all([
      post.proposer ? getUserByAddress(post.proposer) : null,
      businessDb.lookupMany({
        from: "reaction",
        for: post,
        as: "reactions",
        localField: "_id",
        foreignField: postType,
      }),
      preImageCol.findOne({ hash: post.externalProposalHash }),
      chainExternal.motions?.length > 0
        ? chainMotionCol
            .find({
              $or: chainExternal.motions.map((motion) => ({
                hash: motion.hash,
                "indexer.blockHeight": motion.indexer.blockHeight,
              })),
            })
            .toArray()
        : [],
      chainExternal.techCommMotions?.length > 0
        ? chainTechCommMotionCol
            .find({
              $or: chainExternal.techCommMotions.map((motion) => ({
                hash: motion.hash,
                "indexer.blockHeight": motion.indexer.blockHeight,
              })),
            })
            .toArray()
        : [],
    ]);

  await Promise.all([lookupUser({ for: reactions, localField: "user" })]);

  return {
    ...post,
    _id: chainExternal._id,
    externalProposalHash: chainExternal.proposalHash,
    indexer: chainExternal.indexer,
    referendumIndex: chainExternal.referendumIndex,
    state: chainExternal.state?.state,
    author,
    authors: chainExternal.authors,
    onchainData: {
      ...chainExternal,
      preImage,
      motions,
      techCommMotions,
    },
  };
}

async function processCommentMentions({
  postType,
  postUid,
  content,
  contentType,
  author,
  commentHeight,
  mentions,
}) {
  if (mentions.size === 0) {
    return;
  }

  const userCol = await getUserCollection();
  const users = await userCol
    .find({
      username: {
        $in: Array.from(mentions),
      },
    })
    .toArray();

  for (const user of users) {
    if (user.emailVerified && (user.notification?.mention ?? true)) {
      mailService.sendCommentMentionEmail({
        email: user.email,
        postType,
        postUid,
        content,
        contentType,
        mentionedUser: user.username,
        author,
        commentHeight,
      });
    }
  }
}

async function postComment(postId, content, contentType, author) {
  const chainExternal = await findExternal(postId);
  if (!chainExternal) {
    throw new HttpError(404, "External does not found");
  }

  const [postCol, post, postType] = await findExternalPost(chainExternal);
  if (!post) {
    throw new HttpError(404, "External post does not found");
  }

  const postObjId = post._id;

  const userCol = await getUserCollection();
  const postAuthor = await userCol.findOne({ _id: post.author });
  post.author = postAuthor;

  const commentCol = await getCommentCollection();
  const height = await commentCol.countDocuments({ [postType]: postObjId });

  const now = new Date();

  const newComment = {
    [postType]: postObjId,
    content: contentType === ContentType.Html ? safeHtml(content) : content,
    contentType,
    contentVersion: "2",
    author: author._id,
    height: height + 1,
    createdAt: now,
    updatedAt: now,
  };
  const result = await commentCol.insertOne(newComment);

  if (!result.acknowledged) {
    throw new HttpError(500, "Failed to create comment");
  }

  const newCommentId = result.insertedId;

  const updatePostResult = await postCol.updateOne(
    { _id: postObjId },
    {
      $set: {
        lastActivityAt: new Date(),
      },
    }
  );

  if (!updatePostResult.acknowledged) {
    throw new HttpError(500, "Unable to udpate post last activity time");
  }

  const mentions = extractMentions(content, contentType);
  processCommentMentions({
    postType,
    postUid: post.postUid,
    content: newComment.content,
    contentType: newComment.contentType,
    author: author.username,
    commentHeight: newComment.height,
    mentions,
  }).catch(console.error);

  if (post.author && !author._id.equals(post.author._id)) {
    if (
      post.author.emailVerified &&
      (post.author.notification?.reply ?? true)
    ) {
      mailService.sendReplyEmail({
        email: post.author.email,
        replyToUser: post.author.username,
        postType,
        postUid: post.postUid,
        content: newComment.content,
        contentType: newComment.contentType,
        author: author.username,
        commentHeight: newComment.height,
      });
    }
  }

  return newCommentId;
}

async function getComments(postId, page, pageSize) {
  const chainExternal = await findExternal(postId);
  if (!chainExternal) {
    throw new HttpError(404, "External does not found");
  }

  const [, post, postType] = await findExternalPost(chainExternal);
  if (!post) {
    throw new HttpError(404, "External post does not found");
  }
  const q = { [postType]: post._id };

  const commentCol = await getCommentCollection();
  const total = await commentCol.count(q);

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const comments = await commentCol
    .find(q)
    .sort({ createdAt: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const businessDb = await getBusinessDb();
  const reactions = await businessDb.lookupMany({
    from: "reaction",
    for: comments,
    as: "reactions",
    localField: "_id",
    foreignField: "comment",
  });

  await lookupUser([
    { for: comments, localField: "author" },
    { for: reactions, localField: "user" },
  ]);

  return {
    items: comments,
    total,
    page,
    pageSize,
  };
}

async function processPostThumbsUpNotification(post, postType, reactionUser) {
  const userCol = await getUserCollection();
  const postAuthor = await userCol.findOne({ _id: post.author });

  if (!postAuthor) {
    return;
  }

  if (postAuthor.emailVerified && (postAuthor.notification?.thumbsUp ?? true)) {
    mailService.sendPostThumbsupEmail({
      email: postAuthor.email,
      postAuthor: postAuthor.username,
      postType,
      postUid: post.postUid,
      reactionUser: reactionUser.username,
    });
  }
}

async function setPostReaction(postId, reaction, user) {
  const chainExternal = await findExternal(postId);
  if (!chainExternal) {
    throw new HttpError(404, "External does not found");
  }

  const [, post, postType] = await findExternalPost(chainExternal);
  if (!post) {
    throw new HttpError(404, "External Post does not found");
  }

  const postObjId = post._id;

  const reactionCol = await getReactionCollection();

  const now = new Date();
  const result = await reactionCol.updateOne(
    {
      [postType]: postObjId,
      user: user._id,
    },
    {
      $set: {
        reaction,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Db error, update reaction.");
  }

  processPostThumbsUpNotification(post, postType, user).catch(console.error);

  return true;
}

async function unsetPostReaction(postId, user) {
  const chainExternal = await findExternal(postId);
  if (!chainExternal) {
    throw new HttpError(404, "External does not found");
  }

  const [, post, postType] = await findExternalPost(chainExternal);
  if (!post) {
    throw new HttpError(404, "External Post does not found");
  }

  const postObjId = post._id;

  const reactionCol = await getReactionCollection();

  const result = await reactionCol.deleteOne({
    [postType]: postObjId,
    user: user._id,
  });

  if (!result.acknowledged) {
    throw new HttpError(500, "Db error, clean reaction.");
  }

  if (result.modifiedCount === 0) {
    return false;
  }

  return true;
}

module.exports = {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
  postComment,
  getComments,
  setPostReaction,
  unsetPostReaction,
};
