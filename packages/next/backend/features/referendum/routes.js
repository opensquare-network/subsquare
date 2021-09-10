const Router = require("koa-router");
const proposalController = require("./referendum.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/democracy/referendum", proposalController.getPosts);

router.get("/democracy/referendum/:postId", proposalController.getPostById);

router.patch("/democracy/referendum/:postId", requireAuth, proposalController.updatePost);

router.post("/democracy/referendum/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/democracy/referendum/:postId/comments", proposalController.getComments);

router.put(
  "/democracy/referendum/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/democracy/referendum/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
