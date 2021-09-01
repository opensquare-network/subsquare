const Router = require("koa-router");
const bountyController = require("./bounty.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/bounties", bountyController.getPosts);

router.get("/bounties/:postId", bountyController.getPostById);

router.patch("/bounties/:postId", requireAuth, bountyController.updatePost);

router.post("/bounties/:postId/comments", requireAuth, requireVerify, bountyController.postComment);

router.get("/bounties/:postId/comments", bountyController.getComments);

router.put(
  "/bounties/:postId/reaction",
  requireAuth,
  requireVerify,
  bountyController.setPostReaction
);

router.delete(
  "/bounties/:postId/reaction",
  requireAuth,
  bountyController.unsetPostReaction
);

module.exports = router;
