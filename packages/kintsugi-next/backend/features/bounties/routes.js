const Router = require("koa-router");
const bountyController = require("./bounty.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.get("/treasury/bounties", bountyController.getPosts);

router.get("/treasury/bounties/:postId", bountyController.getPostById);

router.patch(
  "/treasury/bounties/:postId",
  requireAuth,
  bountyController.updatePost
);

router.post(
  "/treasury/bounties/:postId/comments",
  requireAuth,
  requireVerify,
  bountyController.postComment
);

router.get("/treasury/bounties/:postId/comments", bountyController.getComments);

router.put(
  "/treasury/bounties/:postId/reaction",
  requireAuth,
  requireVerify,
  bountyController.setPostReaction
);

router.delete(
  "/treasury/bounties/:postId/reaction",
  requireAuth,
  bountyController.unsetPostReaction
);

module.exports = router;
