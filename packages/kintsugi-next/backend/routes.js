const Router = require("koa-router");

const router = new Router();

const chainFeatureRouters = [
  require("./features/proposals/routes"),
  require("./features/public-proposals/routes"),
  require("./features/referendums/routes"),
  require("./features/tech-comm/motions/routes"),
  require("./features/overview/routes"),
];

module.exports = (app) => {
  for (const r of chainFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }
  app.use(router.routes());
};
