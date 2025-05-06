import { parse } from "url";
import next from "next";
import nextEnv from "@next/env";
import { createServer } from "http";

// Load next env
const projectDir = process.cwd();
nextEnv.loadEnvConfig(projectDir);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const nextHandler = app.getRequestHandler();

const PORT = parseInt(process.env.PORT, 10);
if (!PORT) {
  console.info("PORT is not defined");
  process.exit();
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    nextHandler(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.info(`> Ready on http://127.0.0.1:${PORT}`);
  });
});
