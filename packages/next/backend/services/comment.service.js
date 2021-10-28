const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const {
  getCommentCollection,
  getReactionCollection,
  getDb: getBusinessDb
} = require("../mongo/business");
const { getUserCollection, lookupUser } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const mailService = require("./mail.service");

async function updateComment(
  chain,
  commentId,
  content,
  contentType,
  author,
) {
  const commentObjId = ObjectId(commentId);
  const commentCol = await getCommentCollection(chain);
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
        updatedAt: new Date(),
      }
    }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Failed to update comment");
  }

  return true;
}


async function unsetCommentReaction(chain, commentId, user) {
  const commmentObjId = ObjectId(commentId);

  const reactionCol = await getReactionCollection(chain);

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

async function processCommentThumbsUpNotification(chain, comment, reactionUser) {
  let postType = "post";
  if (comment.tip) {
    postType = "tip";
  }
  const businessDb = await getBusinessDb(chain);
  const postCol = businessDb.getCollection(postType);
  const userCol = await getUserCollection();
  const [post, commentAuthor] = await Promise.all([
    postCol.findOne({_id: comment[postType]}),
    userCol.findOne({_id: comment.author}),
  ]);

  if (!post || !commentAuthor) {
    return;
  }

  if (commentAuthor.emailVerified && (commentAuthor.notification?.thumbsUp ?? true)) {
    mailService.sendCommentThumbsupEmail({
      email: commentAuthor.email,
      commentAuthor: commentAuthor.username,
      chain,
      postType,
      postUid: post.postUid,
      commentHeight: comment.height,
      content: comment.content,
      contentType: comment.contentType,
      reactionUser: reactionUser.username,
    });
  }
}

async function setCommentReaction(chain, commentId, reaction, user) {
  const commmentObjId = ObjectId(commentId);

  const commentCol = await getCommentCollection(chain);
  const comment = await commentCol.findOne({
    _id: commmentObjId,
    author: { $ne: user._id },
  });
  if (!comment) {
    throw new HttpError(400, "Cannot set reaction.");
  }

  const reactionCol = await getReactionCollection(chain);

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

  processCommentThumbsUpNotification(chain, comment, user).catch(console.error);

  return true;
}

async function getComment(chain, commentId) {
  const commentObjId = ObjectId(commentId);

  const commentCol = await getCommentCollection(chain);
  const comment = await commentCol.findOne({ _id: commentObjId });
  if (!comment) {
    throw new HttpError(400, "Comment does not exists");
  }

  const businessDb = await getBusinessDb(chain);
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
