const Router = require("koa-router");

const router = new Router();

const chainFeatureRouters = [
  require("./features/posts/routes"),
  require("./features/proposals/routes"),
  require("./features/public-proposals/routes"),
  require("./features/referendums/routes"),
  require("./features/tech-comm/motions/routes"),
  require("./features/comments/routes"),
  require("./features/overview/routes"),
];

const commonFeatureRouters = [
  require("./features/auth/routes"),
  require("./features/users/routes"),
  require("./features/inspect/routes"),
];

module.exports = (app) => {
  for (const r of commonFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }

  for (const r of chainFeatureRouters) {
    router.use(r.routes(), r.allowedMethods({ throw: true }));
  }
  app.use(router.routes());
};
