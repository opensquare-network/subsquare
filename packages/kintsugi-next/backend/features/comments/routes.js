const Router = require("koa-router");
const commentController = require("./comment.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/comments/:commentId", commentController.getComment);

router.patch(
  "/comments/:commentId",
  requireAuth,
  commentController.updateComment
);

router.put(
  "/comments/:commentId/reaction",
  requireAuth,
  requireVerify,
  commentController.setCommentReaction
);

router.delete(
  "/comments/:commentId/reaction",
  requireAuth,
  commentController.unsetCommentReaction
);

module.exports = router;
