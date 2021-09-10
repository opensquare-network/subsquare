const Router = require("koa-router");
const motionsController = require("./motion.controller");

const router = new Router();

router.get("/tech-comm/motions", motionsController.getMotions);

router.get("/tech-comm/motions/:motionId", motionsController.getMotionById);

module.exports = router;
