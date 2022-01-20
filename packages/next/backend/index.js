const { app, koaHandler, ioHandler } = require("@subsquare/backend-common");

require("./routes")(app);

module.exports = {
  koaHandler,
  ioHandler,
};
