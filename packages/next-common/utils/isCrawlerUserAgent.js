// Search engine render bots, link previewers and monitoring probes do run our client
// bundle, but the failures they run into (a blocked .wasm asset, an aborted request, a
// blocked third party) are not user-facing bugs, so we skip reporting those.
// Tokens follow the common crawler user agent lists (see e.g. the isbot package).
const CRAWLER_UA_PATTERN =
  /baiduspider|googlebot|bingbot|yandex|sogou|exabot|duckduckbot|applebot|petalbot|bytespider|mj12bot|dotbot|semrush|ahrefs|ia_archiver|slurp|crawler|spider|scrapy|facebookexternalhit|twitterbot|slackbot|telegrambot|discordbot|whatsapp|embedly|pinterest|uptimerobot|pingdom|lighthouse|headlesschrome|headless|python-requests|python-urllib|go-http-client|okhttp|curl\/|wget\//i;

/**
 * @param {string} [userAgent] Defaults to the current browser's user agent.
 */
export default function isCrawlerUserAgent(userAgent) {
  const ua =
    userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");

  return CRAWLER_UA_PATTERN.test(ua || "");
}
