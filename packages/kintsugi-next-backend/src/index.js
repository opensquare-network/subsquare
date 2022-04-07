const dotenv = require("dotenv");
dotenv.config();

const { createServer } = require("http");
const { app, koaHandler, ioHandler } = require("@subsquare/backend-common");

require("./routes")(app);

const httpServer = createServer(koaHandler);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

ioHandler(io);

const PORT = process.env.PORT;
if (!PORT) {
  console.log("PORT is not defined");
  process.exit();
}

httpServer.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://127.0.0.1:${PORT}`);
});
