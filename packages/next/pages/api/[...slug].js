import httpProxy from "http-proxy";
import { isApiDisabled } from "next-common/api/disabledApi";

const ssrUrl = new URL(process.env.NEXT_PUBLIC_BACKEND_API_END_POINT);
const proxy = httpProxy.createProxyServer({
  target: {
    protocol: ssrUrl.protocol,
    host: ssrUrl.hostname,
    port: ssrUrl.port,
  },
  changeOrigin: true,
});

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (isApiDisabled(req)) {
    res.status(404).send("Not found");
    return;
  }
  req.url = req.url.replace(/^\/api\//, ssrUrl.pathname);
  proxy.web(req, res, { autoRewrite: false });
}
