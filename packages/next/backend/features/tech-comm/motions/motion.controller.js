const { extractPage } = require("../../../utils");
const motionService = require("../../../services/tech-comm-motion.service");
const { ContentType } = require("../../../constants");
const { HttpError } = require("../../../exc");

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

  ctx.body = await motionService.updatePost(
    postId,
    title,
    content,
    contentType,
    ctx.user
  );
}

async function getMotions(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 1) {
    ctx.status = 400;
    return;
  }

  ctx.body = await motionService.getMotionsByChain(page, pageSize);
}

async function getMotionById(ctx) {
  const { postId } = ctx.params;

  ctx.body = await motionService.getMotionById(postId);
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

  ctx.body = await motionService.postComment(
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
  ctx.body = await motionService.getComments(postId, page, pageSize);
}

async function setPostReaction(ctx) {
  const { postId } = ctx.params;
  const { reaction } = ctx.request.body;

  if (reaction === undefined) {
    throw new HttpError(400, "Reaction is missing");
  }

  const user = ctx.user;
  ctx.body = await motionService.setPostReaction(
    postId,
    reaction,
    user
  );
}

async function unsetPostReaction(ctx) {
  const { postId } = ctx.params;
  const user = ctx.user;
  ctx.body = await motionService.unsetPostReaction(postId, user);
}

module.exports = {
  updatePost,
  getMotions,
  getMotionById,
  postComment,
  getComments,
  setPostReaction,
  unsetPostReaction,
};
