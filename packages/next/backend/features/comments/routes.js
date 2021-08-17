const Router = require("koa-router");
const commentController = require("./comment.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.patch("/comments/:commentId", requireAuth, commentController.updateComment);

module.exports = router;
