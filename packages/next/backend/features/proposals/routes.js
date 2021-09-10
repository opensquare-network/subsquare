const Router = require("koa-router");
const proposalController = require("./proposal.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/treasury/proposals", proposalController.getPosts);

router.get("/treasury/proposals/:postId", proposalController.getPostById);

router.patch("/treasury/proposals/:postId", requireAuth, proposalController.updatePost);

router.post("/treasury/proposals/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/treasury/proposals/:postId/comments", proposalController.getComments);

router.put(
  "/treasury/proposals/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/treasury/proposals/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
