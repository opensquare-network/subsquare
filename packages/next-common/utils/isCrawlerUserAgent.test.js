import { describe, expect, it } from "vitest";
import isCrawlerUserAgent from "./isCrawlerUserAgent";

describe("isCrawlerUserAgent", () => {
  it("detects search engine render bots", () => {
    // The one that showed up in our client error report
    expect(
      isCrawlerUserAgent(
        "Mozilla/5.0 (compatible; Baiduspider-render/2.0; +http://www.baidu.com/search/spider.html)",
      ),
    ).toBe(true);
    expect(isCrawlerUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(
      true,
    );
    expect(
      isCrawlerUserAgent("Mozilla/5.0 (compatible; bingbot/2.0)"),
    ).toBe(true);
  });

  it("detects previewers and headless browsers", () => {
    expect(isCrawlerUserAgent("facebookexternalhit/1.1")).toBe(true);
    expect(
      isCrawlerUserAgent(
        "Mozilla/5.0 HeadlessChrome/137.0.0.0 Safari/537.36",
      ),
    ).toBe(true);
    expect(isCrawlerUserAgent("curl/8.4.0")).toBe(true);
  });

  it("does not flag real browsers", () => {
    expect(
      isCrawlerUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      ),
    ).toBe(false);
    expect(
      isCrawlerUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      ),
    ).toBe(false);
    // "CUBOT" is a phone brand that appears in real user agents
    expect(
      isCrawlerUserAgent(
        "Mozilla/5.0 (Linux; Android 8.1.0; CUBOT_X18) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
      ),
    ).toBe(false);
    expect(isCrawlerUserAgent("")).toBe(false);
  });
});
