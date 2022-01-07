const Router = require("koa-router");
const motionsController = require("./motion.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/motions", motionsController.getMotions);

router.get("/motions/:postId", motionsController.getMotionById);

router.patch("/motions/:postId", requireAuth, motionsController.updatePost);

router.post(
  "/motions/:postId/comments",
  requireAuth,
  requireVerify,
  motionsController.postComment
);

router.get("/motions/:postId/comments", motionsController.getComments);

router.put(
  "/motions/:postId/reaction",
  requireAuth,
  requireVerify,
  motionsController.setPostReaction
);

router.delete(
  "/motions/:postId/reaction",
  requireAuth,
  motionsController.unsetPostReaction
);

module.exports = router;
