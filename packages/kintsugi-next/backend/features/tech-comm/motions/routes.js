const Router = require("koa-router");
const motionsController = require("./motion.controller");
const requireAuth = require("../../../middleware/require-auth");
const requireVerify = require("../../../middleware/require-verify");

const router = new Router();

router.get("/tech-comm/motions", motionsController.getMotions);

router.get("/tech-comm/motions/:postId", motionsController.getMotionById);

router.patch(
  "/tech-comm/motions/:postId",
  requireAuth,
  motionsController.updatePost
);

router.post(
  "/tech-comm/motions/:postId/comments",
  requireAuth,
  requireVerify,
  motionsController.postComment
);

router.get(
  "/tech-comm/motions/:postId/comments",
  motionsController.getComments
);

router.put(
  "/tech-comm/motions/:postId/reaction",
  requireAuth,
  requireVerify,
  motionsController.setPostReaction
);

router.delete(
  "/tech-comm/motions/:postId/reaction",
  requireAuth,
  motionsController.unsetPostReaction
);

module.exports = router;
