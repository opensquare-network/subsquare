const { ObjectId } = require("mongodb");
const { HttpError } = require("@subsquare/backend-common/exc");
const {
  ContentType,
  PostTitleLengthLimitation,
  Day,
} = require("@subsquare/backend-common/constants");
const {
  safeHtml,
  extractMentions,
} = require("@subsquare/backend-common/utils/post");
const { toUserPublicInfo } = require("@subsquare/backend-common/utils/user");
const {
  getDb: getCommonDb,
  getUserCollection,
  lookupUser,
  getUserByAddress,
} = require("@subsquare/backend-common/mongo/common");
const {
  getTechCommMotionCollection: getChainTechCommMotionCollection,
  getPublicProposalCollection: getChainPublicProposalCollection,
} = require("../mongo/chain");
const {
  getDb: getBusinessDb,
  getCommentCollection,
  getReactionCollection,
  getDemocracyCollection,
  getTechCommMotionCollection,
} = require("../mongo/business");
const mailService = require("@subsquare/backend-common/services/mail.service");

async function findMotion(postId) {
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else if (/^\d+$/.test(postId)) {
    q.index = parseInt(postId);
  } else {
    const m = postId.match(/^(\d+)_(.+)$/);
    if (m) {
      q["indexer.blockHeight"] = parseInt(m[1]);
      q.hash = m[2];
    } else {
      q.hash = postId;
    }
  }

  const chainMotionCol = await getChainTechCommMotionCollection();
  return await chainMotionCol.findOne(q, {
    sort: [["indexer.blockHeight", -1]],
  });
}

async function findMotionPost(chainMotion) {
  let postCol;
  let post;
  let postType;

  if (chainMotion.publicProposals?.length === 1) {
    const proposalIndex = chainMotion.publicProposals[0].proposalIndex;

    postCol = await getDemocracyCollection();
    post = await postCol.findOne({ proposalIndex });
    postType = "democracy";
  } else {
    const hash = chainMotion.hash;
    const height = chainMotion.indexer.blockHeight;

    postCol = await getTechCommMotionCollection();
    post = await postCol.findOne({ hash, height });
    postType = "techCommMotion";
  }

  return [postCol, post, postType];
}

async function loadPostForMotions(chainMotions) {
  const chain = process.env.CHAIN;
  for (const motion of chainMotions) {
    if (motion.publicProposals?.length === 1) {
      motion.publicProposalIndex = motion.publicProposals[0].proposalIndex;
    }
  }

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();

  const [democracyPosts, motionPosts] = await Promise.all([
    businessDb.lookupOne({
      from: "democracy",
      for: chainMotions,
      as: "democracyPost",
      localField: "publicProposalIndex",
      foreignField: "proposalIndex",
    }),
    businessDb.compoundLookupOne({
      from: "techCommMotion",
      for: chainMotions,
      as: "motionPost",
      compoundLocalFields: ["hash", "indexer.blockHeight"],
      compoundForeignFields: ["hash", "height"],
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
      foreignField: "techCommMotion",
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

  return chainMotions.map((motion) => {
    const post = {
      ...(motion.democracyPost ?? motion.motionPost),
    };
    motion.democracyPost = undefined;
    motion.motionPost = undefined;
    post._id = motion._id;
    post.motionIndex = motion.index;
    post.hash = motion.hash;
    post.height = motion.indexer.blockHeight;
    post.indexer = motion.indexer;
    post.onchainData = motion;
    post.state = motion.state?.state;
    return post;
  });
}

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;

  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion is not found");
  }

  const [postCol, post, postType] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  // Check if author is allow to edit
  if (postType === "democracy") {
    const chainPublicProposalCol = await getChainPublicProposalCollection();
    const chainPublicProposal = await chainPublicProposalCol.findOne({
      proposalHash: post.externalProposalHash,
    });

    if (!chainPublicProposal) {
      throw new HttpError(404, "On-chain external proposal data is not found");
    }

    if (!chainPublicProposal.authors.includes(author[`${chain}Address`])) {
      throw new HttpError(403, "You cannot edit");
    }
  } else {
    if (!chainMotion.authors.includes(author[`${chain}Address`])) {
      throw new HttpError(403, "You cannot edit");
    }
  }

  if (title.length > PostTitleLengthLimitation) {
    throw new HttpError(400, {
      title: ["Title must be no more than %d characters"],
    });
  }

  const postObjId = post._id;
  const now = new Date();

  const result = await postCol.updateOne(
    { _id: postObjId },
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

async function getActiveMotionsOverview() {
  const motionCol = await getChainTechCommMotionCollection();
  const motions = await motionCol
    .find(
      {
        $or: [
          {
            "state.state": {
              $nin: ["Approved", "Disapproved", "Executed"],
            },
          },
          {
            "state.indexer.blockTime": {
              $gt: Date.now() - Day,
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

  const result = await loadPostForMotions(motions);

  return result;
}

async function getMotionsByChain(page, pageSize) {
  const chainMotionCol = await getChainTechCommMotionCollection();
  const total = await chainMotionCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const motions = await chainMotionCol
    .find({}, { projection: { timeline: 0 } })
    .sort({ "indexer.blockHeight": -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const posts = await loadPostForMotions(motions);

  return {
    items: posts,
    total,
    page,
    pageSize,
  };
}

async function getMotionById(postId) {
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Post not found");
  }

  const techCommMotionCol = await getTechCommMotionCollection();
  const democracyCol = await getDemocracyCollection();
  const reactionCol = await getReactionCollection();
  const chainPublicProposalCol = await getChainPublicProposalCollection();

  let post;
  let reactions;
  let postType;

  if (chainMotion.publicProposals?.length === 1) {
    const proposalIndex = chainMotion.publicProposals[0].proposalIndex;

    post = await democracyCol.findOne({ proposalIndex });
    reactions = await reactionCol.find({ democracy: post._id }).toArray();
    postType = "democracy";
  } else {
    const hash = chainMotion.hash;
    const height = chainMotion.indexer.blockHeight;

    post = await techCommMotionCol.findOne({ hash, height });
    reactions = await reactionCol.find({ techCommMotion: post._id }).toArray();
    postType = "techCommMotion";
  }

  const [, author, publicProposals] = await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
    post.proposer ? getUserByAddress(post.proposer) : null,
    chainMotion.publicProposals?.length > 0
      ? chainPublicProposalCol
          .find({
            proposalIndex: {
              $in: chainMotion.publicProposals.map((p) => p.proposalIndex),
            },
          })
          .sort({ "indexer.blockHeight": 1 })
          .toArray()
      : [],
  ]);

  return {
    ...post,
    _id: chainMotion._id,
    motionIndex: chainMotion.index,
    hash: chainMotion.hash,
    height: chainMotion.indexer.blockHeight,
    indexer: chainMotion.indexer,
    authors:
      postType === "democracy"
        ? publicProposals[0].authors
        : chainMotion.authors,
    onchainData: {
      ...chainMotion,
      publicProposals,
    },
    state: chainMotion.state?.state,
    author,
    reactions,
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
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion does not found");
  }

  const [, post, postType] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not found");
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
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion does not found");
  }

  const [, post, postType] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not found");
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
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion does not found");
  }

  const [postCol, post, postType] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not found");
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
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion does not found");
  }

  const [, post, postType] = await findMotionPost(chainMotion);
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

module.exports = {
  updatePost,
  getMotionsByChain,
  getMotionById,
  getActiveMotionsOverview,
  setPostReaction,
  unsetPostReaction,
  postComment,
  getComments,
};
