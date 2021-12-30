const { ObjectId } = require("mongodb");
const { HttpError } = require("../exc");
const { ContentType, Day } = require("../constants");
const { PostTitleLengthLimitation } = require("../constants");
const { safeHtml, extractMentions } = require("../utils/post");
const { toUserPublicInfo } = require("../utils/user");
const {
  getFinancialMotionCollection: getChainFinancialMotionCollection,
} = require("../mongo/chain");
const {
  getDb: getCommonDb,
  getUserCollection,
  lookupUser,
} = require("../mongo/common");
const {
  getDb: getBusinessDb,
  getFinancialMotionCollection,
  getCommentCollection,
  getReactionCollection,
} = require("../mongo/business");
const mailService = require("./mail.service");

async function findMotion(post) {
  const chainMotionCol = await getChainFinancialMotionCollection();
  return await chainMotionCol.findOne({
    hash: post.hash,
    "indexer.blockHeight": post.height,
  });
}

async function findMotionPost(postId) {
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else if (/^\d+$/.test(postId)) {
    q.motionIndex = parseInt(postId);
  } else {
    const m = postId.match(/^(\d+)_(.+)$/);
    if (m) {
      q.height = parseInt(m[1]);
      q.hash = m[2];
    } else {
      q.hash = postId;
    }
  }

  const motionCol = await getFinancialMotionCollection();
  const post = await motionCol.findOne(q);
  const postType = "financialMotion";

  return [motionCol, post, postType];
}

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;

  const [postCol, post, postType] = await findMotionPost(postId);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainMotion = await findMotion(post);
  if (!chainMotion) {
    throw new HttpError(404, "Motion is not found");
  }

  // Check if author is allow to edit
  if (!chainMotion.authors.includes(author[`${chain}Address`])) {
    throw new HttpError(403, "You cannot edit");
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

async function loadPostForMotions(chainMotions) {
  const chain = process.env.CHAIN;

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();

  const [motionPosts] = await Promise.all([
    businessDb.compoundLookupOne({
      from: "financialMotion",
      for: chainMotions,
      as: "post",
      compoundLocalFields: ["hash", "indexer.blockHeight"],
      compoundForeignFields: ["hash", "height"],
    }),
  ]);

  await Promise.all([
    businessDb.lookupCount({
      from: "comment",
      for: motionPosts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "financialMotion",
    }),
    commonDb.lookupOne({
      from: "user",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
      for: motionPosts,
      as: "author",
      localField: "proposer",
    }),
  ]);

  return chainMotions.map((motion) => {
    const post = {
      ...motion.post,
    };
    motion.post = undefined;
    post.onchainData = motion;
    post.state = motion.state?.state;
    return post;
  });
}

async function getActiveMotionsOverview() {
  const motionCol = await getChainFinancialMotionCollection();
  const motions = await motionCol
    .find({
      "state.state": { $nin: ["Approved", "Disapproved", "Executed"] },
    })
    .sort({ "indexer.blockHeight": -1 })
    .toArray();

  const result = await loadPostForMotions(motions);

  return result
    .filter((post) => post.lastActivityAt?.getTime() >= Date.now() - 7 * Day)
    .slice(0, 3);
}

async function getMotionsByChain(page, pageSize) {
  const chainMotionCol = await getChainFinancialMotionCollection();
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

  const [postCol, post, postType] = await findMotionPost(postId);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainMotion = await findMotion(post);
  if (!chainMotion) {
    throw new HttpError(404, "Motion is not found");
  }

  const reactionCol = await getReactionCollection();
  const userCol = await getUserCollection();

  const reactions = await reactionCol.find({ motion: post._id }).toArray();

  const [, author] = await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
    userCol.findOne({ [`${chain}Address`]: post.proposer }),
  ]);

  return {
    ...post,
    reactions,
    author,
    state: chainMotion.state?.state,
    authors: chainMotion.authors,
    onchainData: chainMotion,
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
  const [postCol, post, postType] = await findMotionPost(postId);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
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
  const [postCol, post, postType] = await findMotionPost(postId);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
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
  const [postCol, post, postType] = await findMotionPost(postId);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
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
  const [postCol, post, postType] = await findMotionPost(postId);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
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
