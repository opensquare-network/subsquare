const Router = require("koa-router");
const proposalController = require("./external-proposal.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/external-proposals", proposalController.getPosts);

router.get("/external-proposals/:postId", proposalController.getPostById);

router.patch("/external-proposals/:postId", requireAuth, proposalController.updatePost);

router.post("/external-proposals/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/external-proposals/:postId/comments", proposalController.getComments);

router.put(
  "/external-proposals/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/external-proposals/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
