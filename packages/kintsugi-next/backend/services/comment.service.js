const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const {
  getCommentCollection,
  getReactionCollection,
  getDb: getBusinessDb,
} = require("../mongo/business");
const { getUserCollection, lookupUser } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const mailService = require("./mail.service");

async function updateComment(commentId, content, contentType, author) {
  const commentObjId = ObjectId(commentId);
  const commentCol = await getCommentCollection();
  const comment = await commentCol.findOne({ _id: commentObjId });
  if (!comment) {
    throw new HttpError(404, "Comment does not exists");
  }

  if (!comment.author.equals(author._id)) {
    throw new HttpError(403, "You are not the comment author");
  }

  const result = await commentCol.updateOne(
    { _id: commentObjId },
    {
      $set: {
        content: contentType === ContentType.Html ? safeHtml(content) : content,
        contentType,
        contentVersion: comment.contentVersion ?? "2",
        updatedAt: new Date(),
      },
    }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Failed to update comment");
  }

  return true;
}

async function unsetCommentReaction(commentId, user) {
  const commmentObjId = ObjectId(commentId);

  const reactionCol = await getReactionCollection();

  const result = await reactionCol.deleteOne({
    comment: commmentObjId,
    user: user._id,
  });

  if (!result.acknowledged) {
    throw new HttpError(500, "Db error, clean reaction.");
  }

  if (result.deletedCount === 0) {
    return false;
  }

  return true;
}

async function processCommentThumbsUpNotification(comment, reactionUser) {
  let postType = "post";
  if (comment.tip) {
    postType = "tip";
  }
  const businessDb = await getBusinessDb();
  const postCol = businessDb.getCollection(postType);
  const userCol = await getUserCollection();
  const [post, commentAuthor] = await Promise.all([
    postCol.findOne({ _id: comment[postType] }),
    userCol.findOne({ _id: comment.author }),
  ]);

  if (!post || !commentAuthor) {
    return;
  }

  if (
    commentAuthor.emailVerified &&
    (commentAuthor.notification?.thumbsUp ?? true)
  ) {
    mailService.sendCommentThumbsupEmail({
      email: commentAuthor.email,
      commentAuthor: commentAuthor.username,
      postType,
      postUid: post.postUid,
      commentHeight: comment.height,
      content: comment.content,
      contentType: comment.contentType,
      reactionUser: reactionUser.username,
    });
  }
}

async function setCommentReaction(commentId, reaction, user) {
  const commmentObjId = ObjectId(commentId);

  const commentCol = await getCommentCollection();
  const comment = await commentCol.findOne({
    _id: commmentObjId,
    author: { $ne: user._id },
  });
  if (!comment) {
    throw new HttpError(400, "Cannot set reaction.");
  }

  const reactionCol = await getReactionCollection();

  const now = new Date();
  const result = await reactionCol.updateOne(
    {
      comment: commmentObjId,
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

  processCommentThumbsUpNotification(comment, user).catch(console.error);

  return true;
}

async function getComment(commentId) {
  const commentObjId = ObjectId(commentId);

  const commentCol = await getCommentCollection();
  const comment = await commentCol.findOne({ _id: commentObjId });
  if (!comment) {
    throw new HttpError(400, "Comment does not exists");
  }

  const businessDb = await getBusinessDb();
  const reactions = await businessDb.lookupMany({
    from: "reaction",
    for: comment,
    as: "reactions",
    localField: "_id",
    foreignField: "comment",
  });

  await lookupUser([
    { for: comment, localField: "author" },
    { for: reactions, localField: "user" },
  ]);

  return comment;
}

module.exports = {
  updateComment,
  setCommentReaction,
  unsetCommentReaction,
  getComment,
};
