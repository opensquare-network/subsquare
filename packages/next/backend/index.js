const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const i18n = require("./middleware/i18n");
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
    const statusCode = err.statusCode || err.status;
    if (!statusCode) {
      console.error(err.message);
      ctx.status = 500;
      ctx.body = {
        message: "Internal Server Error",
      };
    } else {
      ctx.status = statusCode;
      ctx.body = {
        message: err.message,
        data: err.data,
      };
    }
  }
});

app.use(i18n);

require("./routes")(app);

const koaHandler = app.callback();

module.exports = {
  koaHandler,
  ioHandler,
};
