const Router = require("koa-router");
const inspectController = require("./inspect.controller");

const router = new Router();

router.get("/inspect/scanheight", inspectController.getScanHeight);

module.exports = router;
