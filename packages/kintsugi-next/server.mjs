import { parse } from "url";
import next from "next";
import nextEnv from "@next/env";
import httpProxy from "http-proxy";
import { createServer } from "http";
const { loadEnvConfig } = nextEnv;

// Load next env
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const ssrUrl = new URL(process.env.NEXT_PUBLIC_BACKEND_API_END_POINT);
const proxy = httpProxy.createProxyServer({
  target: {
    protocol: ssrUrl.protocol,
    host: ssrUrl.hostname,
    port: ssrUrl.port,
  },
  changeOrigin: true,
});

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
      req.url = req.url.replace(/^\/api\//, ssrUrl.pathname);
      proxy.web(req, res, { autoRewrite: false });
    } else if (pathname.startsWith("/socket.io/")) {
      proxy.web(req, res, { autoRewrite: false });
    } else {
      nextHandler(req, res, parsedUrl);
    }
  });

  httpServer.on("upgrade", function (req, socket, head) {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname.startsWith("/socket.io/")) {
      proxy.ws(req, socket, head);
    }
  });

  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://127.0.0.1:${PORT}`);
  });
});
