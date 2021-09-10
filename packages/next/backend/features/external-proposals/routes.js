const Router = require("koa-router");
const proposalController = require("./external-proposal.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/democracy/external", proposalController.getPosts);

router.get("/democracy/external/:postId", proposalController.getPostById);

router.patch("/democracy/external/:postId", requireAuth, proposalController.updatePost);

router.post("/democracy/external/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/democracy/external/:postId/comments", proposalController.getComments);

router.put(
  "/democracy/external/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/democracy/external/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
