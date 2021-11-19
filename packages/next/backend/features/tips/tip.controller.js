const { HttpError } = require("../../exc");
const postService = require("../../services/post.service")("tip");
const tipPostService = require("../../services/tip.service");
const { ContentType } = require("../../constants");
const { extractPage } = require("../../utils");

async function updatePost(ctx) {
  const { postId } = ctx.params;
  const {
    title,
    content,
    contentType: paramContentType,
  } = ctx.request.body;

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

  ctx.body = await tipPostService.updatePost(
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

  ctx.body = await tipPostService.getPostsByChain(page, pageSize);
}

async function getPostById(ctx) {
  const { postId } = ctx.params;

  ctx.body = await tipPostService.getPostById(postId);
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

  ctx.body = await postService.postComment(
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
  ctx.body = await postService.getComments(postId, page, pageSize);
}

async function setPostReaction(ctx) {
  const { postId } = ctx.params;
  const { reaction } = ctx.request.body;

  if (reaction === undefined) {
    throw new HttpError(400, "Reaction is missing");
  }

  const user = ctx.user;
  ctx.body = await postService.setPostReaction(
    postId,
    reaction,
    user
  );
}

async function unsetPostReaction(ctx) {
  const { postId } = ctx.params;
  const user = ctx.user;
  ctx.body = await postService.unsetPostReaction(postId, user);
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
