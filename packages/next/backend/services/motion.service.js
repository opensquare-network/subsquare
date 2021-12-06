const { ObjectId } = require("mongodb");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { PostTitleLengthLimitation } = require("../constants");
const { safeHtml } = require("../utils/post");
const { toUserPublicInfo } = require("../utils/user");
const { getMotionCollection: getChainMotionCollection } = require("../mongo/chain");
const {
  getDb: getCommonDb,
  getUserCollection,
  lookupUser,
} = require("../mongo/common");
const {
  getDb: getBusinessDb,
  getMotionCollection,
  getTreasuryProposalCollection,
  getBountyCollection,
  getCommentCollection,
  getReactionCollection,
} = require("../mongo/business");
const mailService = require("./mail.service");

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

  const chainMotionCol = await getChainMotionCollection();
  const chainMotion = await chainMotionCol.findOne(q);
  return chainMotion;
}

async function findMotionPost(chainMotion) {
  let postCol = null;
  let post = null;
  let postType = null;

  if (chainMotion.treasuryBounties?.length === 0 && chainMotion.treasuryProposals?.length === 1) {
    const proposalIndex = chainMotion.treasuryProposals[0].index;

    postCol = await getTreasuryProposalCollection();
    post = await postCol.findOne({ proposalIndex });
    postType = "treasuryProposal";
  } else if (chainMotion.treasuryBounties?.length === 1 && chainMotion.treasuryProposals?.length === 0) {
    const bountyIndex = chainMotion.treasuryBounties[0].index;

    postCol = await getBountyCollection();
    post = await postCol.findOne({ bountyIndex });
    postType = "bounty";
  } else {
    const motionIndex = chainMotion.index;

    postCol = await getMotionCollection();
    post = await postCol.findOne({ motionIndex });
    postType = "motion";
  }

  return [postCol, post, postType];
}

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;

  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(403, "Motion is not found");
  }

  if (!chainMotion.authors.includes(author[`${chain}Address`])) {
    throw new HttpError(403, "You cannot edit");
  }

  if (title.length > PostTitleLengthLimitation) {
    throw new HttpError(400, {
      title: ["Title must be no more than %d characters"],
    });
  }

  const [postCol, post] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
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

async function loadPostForMotions(chainMotions) {
  const chain = process.env.CHAIN;
  for (const motion of chainMotions) {
    if (motion.treasuryProposals?.length === 1 && motion.treasuryBounties?.length === 0) {
      motion.treasuryProposalPost = motion.treasuryProposals[0].index;
    } else if (motion.treasuryBounties?.length === 1 && motion.treasuryProposals?.length === 0) {
      motion.bountyPost = motion.treasuryBounties[0].index;
    }
  }

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();

  const [, treasuryProposalPosts, bountyPosts, motionPosts] = await Promise.all([
    commonDb.lookupOne({
      from: "user",
      for: chainMotions,
      as: "author",
      localField: "proposer",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
    }),
    businessDb.lookupOne({
      from: "treasuryProposal",
      for: chainMotions,
      as: "treasuryProposalPost",
      localField: "treasuryProposalPost",
      foreignField: "proposalIndex",
    }),
    businessDb.lookupOne({
      from: "bounty",
      for: chainMotions,
      as: "bountyPost",
      localField: "bountyPost",
      foreignField: "bountyIndex",
    }),
    businessDb.lookupOne({
      from: "motion",
      for: chainMotions,
      as: "motionPost",
      localField: "index",
      foreignField: "motionIndex",
    }),
  ]);

  await Promise.all([
    businessDb.lookupCount({
      from: "comment",
      for: treasuryProposalPosts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "treasuryProposal",
    }),
    businessDb.lookupCount({
      from: "comment",
      for: bountyPosts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "bounty",
    }),
    businessDb.lookupCount({
      from: "comment",
      for: motionPosts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "motion",
    }),
  ]);

  return chainMotions.map((motion) => {
    const post = motion.treasuryProposalPost ?? motion.bountyPost ?? motion.motionPost;
    motion.treasuryProposalPost = undefined;
    motion.bountyPost = undefined;
    motion.motionPost = undefined;
    post._id = motion._id;
    post.proposer = motion.proposer;
    post.motionIndex = motion.index;
    post.hash = motion.hash;
    post.height = motion.indexer.blockHeight;
    post.indexer = motion.indexer;
    post.author = motion.author;
    post.onchainData = motion;
    post.state = motion.state?.state;
    return post;
  });
}

async function getActiveMotionsOverview() {
  const motionCol = await getChainMotionCollection();
  const motions = await motionCol.find(
    {
      "state.state": { $nin: ["Approved", "Disapproved", "Executed"] }
    })
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  return await loadPostForMotions(motions);
}

async function getMotionsByChain(page, pageSize) {
  const chainMotionCol = await getChainMotionCollection();
  const total = await chainMotionCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const chainMotions = await chainMotionCol
    .find({})
    .sort({ "indexer.blockHeight": -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const posts = await loadPostForMotions(chainMotions);

  return {
    items: posts,
    total,
    page,
    pageSize,
  };
}

async function getMotionById(postId) {
  const chain = process.env.CHAIN;

  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Post not found");
  }

  const reactionCol = await getReactionCollection();
  const userCol = await getUserCollection();

  let post = null;
  let reactions = null;

  if (chainMotion.treasuryProposals?.length === 1 && chainMotion.treasuryBounties?.length === 0) {
    const proposalIndex = chainMotion.treasuryProposals[0].index;

    const proposalCol = await getTreasuryProposalCollection();
    post = await proposalCol.findOne({ proposalIndex });

    reactions = await reactionCol.find({ treasuryProposal: post._id }).toArray();

  } else if (chainMotion.treasuryBounties?.length === 1 && chainMotion.treasuryProposals?.length === 0) {
    const bountyIndex = chainMotion.treasuryBounties[0].index;

    const bountyCol = await getBountyCollection();
    post = await bountyCol.findOne({ bountyIndex });

    reactions = await reactionCol.find({ bounty: post._id }).toArray();

  } else {
    const motionIndex = chainMotion.index;

    const motionCol = await getMotionCollection();
    post = await motionCol.findOne({ motionIndex });

    reactions = await reactionCol.find({ motion: post._id }).toArray();
  }

  const [, author] = await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
    userCol.findOne({ [`${chain}Address`]: chainMotion.proposer }),
  ]);

  return {
    ...post,
    reactions,
    _id: chainMotion._id,
    proposer: chainMotion.proposer,
    motionIndex: chainMotion.index,
    hash: chainMotion.hash,
    height: chainMotion.indexer.blockHeight,
    indexer: chainMotion.indexer,
    author,
    state: chainMotion.state?.state,
    onchainData: {
      ...chainMotion,
      author,
    },
  };
}

async function processPostThumbsUpNotification(post, postType, reactionUser) {
  const userCol = await getUserCollection();
  const postAuthor = await userCol.findOne({_id: post.author});

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
  const users = await userCol.find({
    username: {
      $in: Array.from(mentions),
    },
  }).toArray();

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

async function postComment(
  postId,
  content,
  contentType,
  author,
) {
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
        lastActivityAt: new Date()
      }
    },
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
    if (post.author.emailVerified && (post.author.notification?.reply ?? true)) {
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
  const q = { [postType]: post._id }

  const commentCol = await getCommentCollection();
  const total = await commentCol.count(q);

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const comments = await commentCol.find(q)
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

module.exports =  {
  updatePost,
  getMotionsByChain,
  getMotionById,
  getActiveMotionsOverview,
  setPostReaction,
  unsetPostReaction,
  postComment,
  getComments,
};
