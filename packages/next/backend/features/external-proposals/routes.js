const Router = require("koa-router");
const proposalController = require("./external-proposal.controller");
const requireAuth = require("@subsquare/backend-common/middleware/require-auth");
const requireVerify = require("@subsquare/backend-common/middleware/require-verify");

const router = new Router();

router.get("/democracy/externals", proposalController.getPosts);

router.get("/democracy/externals/:postId", proposalController.getPostById);

router.patch("/democracy/externals/:postId", requireAuth, proposalController.updatePost);

router.post("/democracy/externals/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/democracy/externals/:postId/comments", proposalController.getComments);

router.put(
  "/democracy/externals/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/democracy/externals/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
