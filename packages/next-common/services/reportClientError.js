import isCrawlerUserAgent from "next-common/utils/isCrawlerUserAgent";
import nextApi from "./nextApi";

export async function reportClientError(errorData) {
  // Errors from crawlers/render bots are noise, e.g. a search engine renderer fetching
  // a .wasm asset that gets blocked and failing with "Failed to execute 'compile' on
  // 'WebAssembly': HTTP status code is not ok". They are not user-facing bugs.
  if (isCrawlerUserAgent(errorData?.userAgent)) {
    return;
  }

  await nextApi.post("client-errors", {
    msg_type: "text",
    content: {
      text: JSON.stringify(errorData, null, 2),
    },
  });
}
