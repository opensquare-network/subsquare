const Router = require("koa-router");
const postController = require("./post.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.post("/posts", requireAuth, postController.createPost);

router.get("/posts", postController.getPosts);

router.get("/posts/:postId", postController.getPostById);

router.post("/posts/:postId/comments", requireAuth, postController.postComment);

router.get("/posts/:postId/comments", postController.getComments);

module.exports = router;
