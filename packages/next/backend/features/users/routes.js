const Router = require("koa-router");
const userController = require("./user.controller");
const requireAuth = require("../../middleware/require-auth");
const { SupportChains } = require("../../constants");

const routeChains = SupportChains.join("|");

const router = new Router();

router.get("/user/profile", requireAuth, userController.getUserProfile);
router.post(
  "/user/resendverifyemail",
  requireAuth,
  userController.resendVerifyEmail
);
router.post("/user/changepassword", requireAuth, userController.changePassword);
router.post("/user/deleteaccount", requireAuth, userController.deleteAccount);

router.get(
  `/user/linkaddr/:address`,
  requireAuth,
  userController.linkAddressStart
);
router.post(
  "/user/linkaddr/:attemptId",
  requireAuth,
  userController.linkAddressConfirm
);
router.delete(
  `/user/linkaddr/:address`,
  requireAuth,
  userController.unlinkAddress
);

router.patch(
  "/user/notification",
  requireAuth,
  userController.setUserNotification
);

router.patch(
  "/user/preference",
  requireAuth,
  userController.setUserPreference
);

module.exports = router;
