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
  getCommentCollection,
  getReactionCollection,
  getMotionCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getPublicProposalCollection: getChainPublicProposalCollection,
  getExternalCollection: getChainExternalCollection,
  getReferendumCollection: getChainReferendumCollection,
  getPreImageCollection,
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

async function findReferendum(postId) {
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else {
    q.referendumIndex = parseInt(postId);
  }

  const chainReferendumCol = await getChainReferendumCollection();
  return await chainReferendumCol.findOne(q, {
    sort: [["indexer.blockHeight", -1]],
  });
}

async function findReferendumPost(chainReferendum) {
  let postCol;
  let post;
  let postType;

  postCol = await getDemocracyCollection();
  post = await postCol.findOne(
    { referendumIndex: chainReferendum.referendumIndex },
    { sort: { "indexer.blockHeight": -1 } }
  );
  postType = "democracy";

  if (post.content) {
    return [postCol, post, postType];
  }

  // 查找 Referendum 对应的 External
  const chainExternalCol = await getChainExternalCollection();
  const chainExternal = await chainExternalCol.findOne({
    referendumIndex: chainReferendum.referendumIndex,
  });

  // 当 Democracy post 没有编辑内容时，而且这个 External proposal 只关联了一个 motion，
  // 那么我们认为此关联的 Motion 创建了这个 External。
  //
  // 旧数据中，当 Democracy post 没有编辑内容，而 Motion post有内容时，使用 Motion post
  // 其他情况则使用 Democracy post
  if (chainExternal?.motions?.length === 1) {
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

async function loadPostForReferendums(chainReferendums) {
  const chain = process.env.CHAIN;

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const chainDb = await getChainDb();

  const [democracyPosts] = await Promise.all([
    businessDb.lookupOne({
      from: "democracy",
      for: chainReferendums,
      as: "democracyPost",
      localField: "referendumIndex",
      foreignField: "referendumIndex",
    }),
    chainDb.lookupOne({
      from: "democracyExternal",
      for: chainReferendums,
      as: "democracyExternal",
      localField: "referendumIndex",
      foreignField: "referendumIndex",
    }),
  ]);

  for (const referendum of chainReferendums) {
    if (referendum.democracyPost?.content) {
      continue;
    }
    if (referendum.democracyExternal?.motions?.length !== 1) {
      continue;
    }
    referendum.motionHash = referendum.democracyExternal.motions[0].hash;
    referendum.motionHeight =
      referendum.democracyExternal.motions[0].indexer.blockHeight;
  }

  const motionPosts = await businessDb.compoundLookupOne({
    from: "motion",
    for: chainReferendums,
    as: "motionPost",
    compoundLocalFields: ["motionHash", "motionHeight"],
    compoundForeignFields: ["hash", "indexer.blockHeight"],
  });

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

  return chainReferendums.map((item) => {
    const post = {
      ...(!item.democracyPost.content && item.motionPost?.content
        ? item.motionPost
        : item.democracyPost),
    };
    item.democracyPost = undefined;
    item.motionPost = undefined;
    item.democracyExternal = undefined;
    post._id = item._id;
    post.referendumIndex = item.referendumIndex;
    post.indexer = item.indexer;
    post.onchainData = item;
    post.state = item.state?.state;
    return post;
  });
}

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;

  const chainReferendum = await findReferendum(postId);
  if (!chainReferendum) {
    throw new HttpError(404, "Referendum is not found");
  }

  const [postCol, post, postType] = await findReferendumPost(chainReferendum);
  if (!post) {
    throw new HttpError(404, "Referendum Post does not exists");
  }

  let authors = [];
  if (chainReferendum.externalProposalHash) {
    const col = await getChainExternalCollection();
    const chainExternal = await col.findOne({
      proposalHash: chainReferendum.externalProposalHash,
      "indexer.blockHeight":
        chainReferendum.externalProposalIndexer.blockHeight,
    });
    authors = chainExternal?.authors || [];
  } else if (chainReferendum.publicProposalIndex !== undefined) {
    const col = await getChainPublicProposalCollection();
    const chainPublicProposal = await col.findOne({
      proposalIndex: chainReferendum.publicProposalIndex,
    });
    authors = chainPublicProposal?.authors || [];
  }

  if (!authors.includes(author[`${chain}Address`])) {
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
  const chainReferendumCol = await getChainReferendumCollection();
  const chainReferendums = await chainReferendumCol
    .find(
      {
        $or: [
          {
            "state.state": {
              $nin: ["Executed", "NotPassed", "Passed", "Cancelled"],
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

  const result = await loadPostForReferendums(chainReferendums);

  return result;
}

async function getPostsByChain(page, pageSize) {
  const chainReferendumCol = await getChainReferendumCollection();
  const total = await chainReferendumCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const chainReferendums = await chainReferendumCol
    .find({})
    .sort({ "indexer.blockHeight": -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const posts = await loadPostForReferendums(chainReferendums);

  return {
    items: posts,
    total,
    page,
    pageSize,
  };
}

async function getPostById(postId) {
  const chainReferendum = await findReferendum(postId);
  if (!chainReferendum) {
    throw new HttpError(404, "Referendum is not found");
  }

  const [postCol, post, postType] = await findReferendumPost(chainReferendum);
  if (!post) {
    throw new HttpError(404, "Referendum does not exists");
  }

  const businessDb = await getBusinessDb();
  const [author, reactions] = await Promise.all([
    post.proposer ? getUserByAddress(post.proposer) : null,
    businessDb.lookupMany({
      from: "reaction",
      for: post,
      as: "reactions",
      localField: "_id",
      foreignField: postType,
    }),
  ]);

  if (chainReferendum?.externalProposalHash) {
    const col = await getChainExternalCollection();
    const chainExternal = await col.findOne({
      proposalHash: chainReferendum.externalProposalHash,
      "indexer.blockHeight":
        chainReferendum.externalProposalIndexer.blockHeight,
    });

    chainReferendum.authors = chainExternal?.authors;
    chainReferendum.techCommMotions = chainExternal.techCommMotions;
    chainReferendum.motions = chainExternal.motions;

    const preImageCol = await getPreImageCollection();
    const preImage = await preImageCol.findOne({
      hash: chainReferendum.externalProposalHash,
    });

    chainReferendum.preImage = preImage;
  } else if (chainReferendum?.publicProposalIndex !== undefined) {
    const col = await getChainPublicProposalCollection();
    const chainPublicProposal = await col.findOne({
      proposalIndex: chainReferendum.publicProposalIndex,
    });

    chainReferendum.publicProposal = chainPublicProposal;
    chainReferendum.authors = chainPublicProposal?.authors;

    const preImageCol = await getPreImageCollection();
    const preImage = await preImageCol.findOne({
      hash: chainPublicProposal?.hash,
    });
    chainReferendum.preImage = preImage;
  }

  await lookupUser({ for: reactions, localField: "user" });

  return {
    ...post,
    _id: chainReferendum._id,
    externalProposalHash: chainReferendum.externalProposalHash,
    indexer: chainReferendum.externalProposalIndexer,
    referendumIndex: chainReferendum.referendumIndex,
    state: chainReferendum.state?.state,
    author,
    authors: chainReferendum.authors,
    onchainData: chainReferendum,
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
  const chainReferendum = await findReferendum(postId);
  if (!chainReferendum) {
    throw new HttpError(404, "Referendum does not found");
  }

  const [postCol, post, postType] = await findReferendumPost(chainReferendum);
  if (!post) {
    throw new HttpError(404, "Referendum post does not found");
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
  const chainReferendum = await findReferendum(postId);
  if (!chainReferendum) {
    throw new HttpError(404, "Referendum does not found");
  }

  const [, post, postType] = await findReferendumPost(chainReferendum);
  if (!post) {
    throw new HttpError(404, "Referendum post does not found");
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
  const chainReferendum = await findReferendum(postId);
  if (!chainReferendum) {
    throw new HttpError(404, "Referendum does not found");
  }

  const [, post, postType] = await findReferendumPost(chainReferendum);
  if (!post) {
    throw new HttpError(404, "Referendum Post does not found");
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
  const chainReferendum = await findReferendum(postId);
  if (!chainReferendum) {
    throw new HttpError(404, "Referendum does not found");
  }

  const [, post, postType] = await findReferendumPost(chainReferendum);
  if (!post) {
    throw new HttpError(404, "Referendum Post does not found");
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
