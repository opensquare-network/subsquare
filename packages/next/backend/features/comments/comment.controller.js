const { HttpError } = require("../../exc");
const postService = require("../../services/post.service");
const { ContentType } = require("../../constants");

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

  ctx.body = await postService.updateComment(commentId, content, contentType, ctx.user);
}

async function setCommentReaction(ctx) {
  const commentId = ctx.params.commentId;
  const { reaction } = ctx.request.body;
  const user = ctx.user;
  ctx.body = await postService.setCommentReaction(
    commentId,
    reaction,
    user
  );
}

async function unsetCommentReaction(ctx) {
  const commentId = ctx.params.commentId;
  const user = ctx.user;
  ctx.body = await postService.unsetCommentReaction(commentId, user);
}

module.exports = {
  updateComment,
  setCommentReaction,
  unsetCommentReaction,
}
