const Router = require("koa-router");
const proposalController = require("./referendum.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/referendum", proposalController.getPosts);

router.get("/referendum/:postId", proposalController.getPostById);

router.patch("/referendum/:postId", requireAuth, proposalController.updatePost);

router.post("/referendum/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/referendum/:postId/comments", proposalController.getComments);

router.put(
  "/referendum/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/referendum/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
