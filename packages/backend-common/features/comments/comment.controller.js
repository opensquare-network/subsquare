const { HttpError } = require("../../exc");
const commentService = require("../../services/comment.service");
const { ContentType } = require("../../constants");

async function getComment(ctx) {
  const { commentId } = ctx.params;

  ctx.body = await commentService.getComment(commentId);
}

async function updateComment(ctx) {
  const { commentId } = ctx.params;
  const {
    content,
    contentType: paramContentType,
  } = ctx.request.body;

  if (!content) {
    throw new HttpError(400, { content: [t("Comment content is missing")] });
  }

  if (paramContentType !== undefined && paramContentType !== ContentType.Markdown && paramContentType !== ContentType.Html) {
    throw new HttpError(400, { contentType: ["Unknown content type"] });
  }

  const contentType = paramContentType ? paramContentType : ContentType.Markdown;

  ctx.body = await commentService.updateComment(commentId, content, contentType, ctx.user);
}

async function setCommentReaction(ctx) {
  const { commentId } = ctx.params;
  const { reaction } = ctx.request.body;

  if (reaction === undefined) {
    throw new HttpError(400, "Reaction is missing");
  }

  const user = ctx.user;
  ctx.body = await commentService.setCommentReaction(
    commentId,
    reaction,
    user
  );
}

async function unsetCommentReaction(ctx) {
  const { commentId } = ctx.params;
  const user = ctx.user;
  ctx.body = await commentService.unsetCommentReaction(commentId, user);
}

module.exports = {
  getComment,
  updateComment,
  setCommentReaction,
  unsetCommentReaction,
}
