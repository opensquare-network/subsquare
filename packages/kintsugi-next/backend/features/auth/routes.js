const Router = require("koa-router");
const authController = require("./auth.controller");

const router = new Router();

router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.post("/auth/refresh", authController.refresh);

router.post("/auth/verify", authController.verify);
router.post("/auth/forget", authController.forgetPassword);
router.post("/auth/reset", authController.resetPassword);

router.get(`/auth/login/:address`, authController.addressLoginStart);
router.post("/auth/login/:attemptId", authController.addressLoginConfirm);

module.exports = router;
