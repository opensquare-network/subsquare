const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const { ioHandler } = require("./websocket");

const app = new Koa();

app.use(cors());
app.use(logger());
app.use(bodyParser());
app.use(helmet());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
      data: err.data,
    };
  }
});

require("./routes")(app);

const koaHandler = app.callback();

module.exports = {
  koaHandler,
  ioHandler,
};
