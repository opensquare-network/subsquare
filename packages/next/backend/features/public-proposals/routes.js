const Router = require("koa-router");
const proposalController = require("./public-proposal.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/democracy/proposals", proposalController.getPosts);

router.get("/democracy/proposals/:postId", proposalController.getPostById);

router.patch("/democracy/proposals/:postId", requireAuth, proposalController.updatePost);

router.post("/democracy/proposals/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/democracy/proposals/:postId/comments", proposalController.getComments);

router.put(
  "/democracy/proposals/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/democracy/proposals/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
