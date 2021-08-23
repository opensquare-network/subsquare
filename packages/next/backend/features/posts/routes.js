const Router = require("koa-router");
const postController = require("./post.controller");
const requireAuth = require("../../middleware/require-auth");
const requireVerify = require("../../middleware/require-verify");

const router = new Router();

router.post("/posts", requireAuth, requireVerify, postController.createPost);

router.get("/posts", postController.getPosts);

router.get("/posts/:postId", postController.getPostById);

router.patch("/posts/:postId", requireAuth, postController.updatePost);

router.post("/posts/:postId/comments", requireAuth, requireVerify, postController.postComment);

router.get("/posts/:postId/comments", postController.getComments);

module.exports = router;
