const { HttpError } = require("@subsquare/backend-common/exc");
const referendumPostService = require("../../services/referendum.service");
const { ContentType } = require("@subsquare/backend-common/constants");
const { extractPage } = require("@subsquare/backend-common/utils");

async function updatePost(ctx) {
  const { postId } = ctx.params;
  const { title, content, contentType: paramContentType } = ctx.request.body;

  if (!title) {
    throw new HttpError(400, { title: ["Post title is missing"] });
  }

  if (!content) {
    throw new HttpError(400, { content: ["Post content is missing"] });
  }

  if (
    paramContentType !== undefined &&
    paramContentType !== ContentType.Markdown &&
    paramContentType !== ContentType.Html
  ) {
    throw new HttpError(400, { contentType: ["Unknown content type"] });
  }

  const contentType = paramContentType
    ? paramContentType
    : ContentType.Markdown;

  ctx.body = await referendumPostService.updatePost(
    postId,
    title,
    content,
    contentType,
    ctx.user
  );
}

async function getPosts(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 1) {
    ctx.status = 400;
    return;
  }

  ctx.body = await referendumPostService.getPostsByChain(page, pageSize);
}

async function getPostById(ctx) {
  const { postId } = ctx.params;

  ctx.body = await referendumPostService.getPostById(postId);
}

async function postComment(ctx) {
  const { postId } = ctx.params;
  const { content, contentType: paramContentType } = ctx.request.body;

  if (!content) {
    throw new HttpError(400, { content: ["Comment content is missing"] });
  }

  if (
    paramContentType !== undefined &&
    paramContentType !== ContentType.Markdown &&
    paramContentType !== ContentType.Html
  ) {
    throw new HttpError(400, { contentType: ["Unknown content type"] });
  }

  const contentType = paramContentType
    ? paramContentType
    : ContentType.Markdown;

  ctx.body = await referendumPostService.postComment(
    postId,
    content,
    contentType,
    ctx.user
  );
}

async function getComments(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 1) {
    ctx.status = 400;
    return;
  }

  const { postId } = ctx.params;
  ctx.body = await referendumPostService.getComments(postId, page, pageSize);
}

async function setPostReaction(ctx) {
  const { postId } = ctx.params;
  const { reaction } = ctx.request.body;

  if (reaction === undefined) {
    throw new HttpError(400, "Reaction is missing");
  }

  const user = ctx.user;
  ctx.body = await referendumPostService.setPostReaction(
    postId,
    reaction,
    user
  );
}

async function unsetPostReaction(ctx) {
  const { postId } = ctx.params;
  const user = ctx.user;
  ctx.body = await referendumPostService.unsetPostReaction(postId, user);
}

module.exports = {
  updatePost,
  getPosts,
  getPostById,
  postComment,
  getComments,
  setPostReaction,
  unsetPostReaction,
};
