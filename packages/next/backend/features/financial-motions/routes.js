const Router = require("koa-router");
const motionsController = require("./financial-motions.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/financial-motions", motionsController.getMotions);

router.get("/financial-motions/:postId", motionsController.getMotionById);

router.patch(
  "/financial-motions/:postId",
  requireAuth,
  motionsController.updatePost
);

router.post(
  "/financial-motions/:postId/comments",
  requireAuth,
  requireVerify,
  motionsController.postComment
);

router.get(
  "/financial-motions/:postId/comments",
  motionsController.getComments
);

router.put(
  "/financial-motions/:postId/reaction",
  requireAuth,
  requireVerify,
  motionsController.setPostReaction
);

router.delete(
  "/financial-motions/:postId/reaction",
  requireAuth,
  motionsController.unsetPostReaction
);

module.exports = router;
