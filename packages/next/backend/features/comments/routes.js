const Router = require("koa-router");
const commentController = require("./comment.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.get("/comments/:commentId", commentController.getComment);

router.get("/comments/:commentId/reactions", commentController.getCommentReactions);

router.patch("/comments/:commentId", requireAuth, commentController.updateComment);

router.put(
  "/comments/:commentId/reaction",
  requireAuth,
  commentController.setCommentReaction
);

router.delete(
  "/comments/:commentId/reaction",
  requireAuth,
  commentController.unsetCommentReaction
);

module.exports = router;
