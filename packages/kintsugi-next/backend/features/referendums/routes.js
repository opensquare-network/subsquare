const Router = require("koa-router");
const proposalController = require("./referendum.controller");
const requireAuth = require("@subsquare/backend-common/middleware/require-auth");
const requireVerify = require("@subsquare/backend-common/middleware/require-verify");

const router = new Router();

router.get("/democracy/referendums", proposalController.getPosts);

router.get("/democracy/referendums/:postId", proposalController.getPostById);

router.patch("/democracy/referendums/:postId", requireAuth, proposalController.updatePost);

router.post("/democracy/referendums/:postId/comments", requireAuth, requireVerify, proposalController.postComment);

router.get("/democracy/referendums/:postId/comments", proposalController.getComments);

router.put(
  "/democracy/referendums/:postId/reaction",
  requireAuth,
  requireVerify,
  proposalController.setPostReaction
);

router.delete(
  "/democracy/referendums/:postId/reaction",
  requireAuth,
  proposalController.unsetPostReaction
);

module.exports = router;
