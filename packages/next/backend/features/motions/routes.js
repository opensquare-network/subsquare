const Router = require("koa-router");
const motionsController = require("./motion.controller");

const router = new Router();

router.get("/motions", motionsController.getMotions);

router.get("/motions/:motionId", motionsController.getMotionById);

module.exports = router;
