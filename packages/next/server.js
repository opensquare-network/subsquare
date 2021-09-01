const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { loadEnvConfig } = require("@next/env");
const httpProxy = require("http-proxy");

// Load next env
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const ssrUrl = new URL(process.env.NEXT_PUBLIC_SSR_API_END_POINT);
const proxy = httpProxy.createProxyServer({
  target: {
    protocol: ssrUrl.protocol,
    host: ssrUrl.host,
    port: ssrUrl.port,
  },
  changeOrigin: true,
});

const { koaHandler, ioHandler } = require("./backend");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const nextHandler = app.getRequestHandler();

const PORT = process.env.PORT;
if (!PORT) {
  console.log("PORT is not defined");
  process.exit();
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith("/api/")) {
      if (process.env.MODE === "cors-api-server") {
        proxy.web(req, res, { autoRewrite: false });
      } else {
        req.url = req.url.replace(/^\/api/, "");
        koaHandler(req, res);
      }
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
    console.log(`> Ready on http://127.0.0.1:${PORT}`);
  });
});
