const Router = require("koa-router");
const proposalController = require("./proposal.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/proposals", proposalController.getPosts);

router.get("/proposals/:postId", proposalController.getPostById);

router.patch("/proposals/:postId", requireAuth, proposalController.updatePost);

router.post("/proposals/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/proposals/:postId/comments", proposalController.getComments);

router.put(
  "/proposals/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/proposals/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
