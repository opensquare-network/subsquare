const Router = require("koa-router");
const proposalController = require("./public-proposal.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/public-proposals", proposalController.getPosts);

router.get("/public-proposals/:postId", proposalController.getPostById);

router.patch("/public-proposals/:postId", requireAuth, proposalController.updatePost);

router.post("/public-proposals/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/public-proposals/:postId/comments", proposalController.getComments);

router.put(
  "/public-proposals/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/public-proposals/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
