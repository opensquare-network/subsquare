const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { loadEnvConfig } = require("@next/env");

// Load next env
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const { koaHandler, ioHandler } = require("./backend");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const nextHandler = app.getRequestHandler();

const PORT = process.env.PORT;
if (!PORT) {
  console.log("PORT is not defined");
  process.exit();
}

app
  .prepare()
  .then(() => {
    const httpServer = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      if (pathname.startsWith("/api/")) {
        req.url = req.url.replace(/^\/api/, "");

        koaHandler(req, res);
      } else {
        nextHandler(req, res, parsedUrl);
      }
    });

    const io = require("socket.io")(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    ioHandler(io);

    httpServer.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  });
