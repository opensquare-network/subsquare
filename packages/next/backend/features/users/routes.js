const Router = require("koa-router");
const userController = require("./user.controller");
const requireAuth = require("../../middleware/require-auth");

const router = new Router();

router.get("/user/profile", requireAuth, userController.getUserProfile);
router.post(
  "/user/resendverifyemail",
  requireAuth,
  userController.resendVerifyEmail
);
router.post("/user/changepassword", requireAuth, userController.changePassword);
router.post("/user/changeemail", requireAuth, userController.changeEmail);
router.post("/user/deleteaccount", requireAuth, userController.deleteAccount);

module.exports = router;
