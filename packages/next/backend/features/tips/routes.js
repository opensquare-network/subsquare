const Router = require("koa-router");
const tipController = require("./tip.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/tips", tipController.getPosts);

router.get("/tips/:postId", tipController.getPostById);

router.patch("/tips/:postId", requireAuth, tipController.updatePost);

router.post("/tips/:postId/comments", requireAuth, requireVerify, tipController.postComment);

router.get("/tips/:postId/comments", tipController.getComments);

router.put(
  "/tips/:postId/reaction",
  requireAuth,
  requireVerify,
  tipController.setPostReaction
);

router.delete(
  "/tips/:postId/reaction",
  requireAuth,
  tipController.unsetPostReaction
);

module.exports = router;
