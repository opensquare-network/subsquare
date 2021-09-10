const Router = require("koa-router");
const tipController = require("./tip.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/treasury/tips", tipController.getPosts);

router.get("/treasury/tips/:postId", tipController.getPostById);

router.patch("/treasury/tips/:postId", requireAuth, tipController.updatePost);

router.post("/treasury/tips/:postId/comments", requireAuth, requireVerify, tipController.postComment);

router.get("/treasury/tips/:postId/comments", tipController.getComments);

router.put(
  "/treasury/tips/:postId/reaction",
  requireAuth,
  requireVerify,
  tipController.setPostReaction
);

router.delete(
  "/treasury/tips/:postId/reaction",
  requireAuth,
  tipController.unsetPostReaction
);

module.exports = router;
