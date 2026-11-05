// `getServerSideProps` receives route segments already decoded by Next.js, so a segment
// holding a url metacharacter can only come from a double encoded path: scanners glue
// payloads like `%3Fphpinfo=1` or `%c0%ae%c0%ae` onto existing urls, expecting the server
// to read them as a query string or a traversal. No post id ever looks like that, and a
// detail page rendered with such a segment throws for the missing on-chain data, i.e. a
// 500 page plus a server error report, so those requests are answered as a missing page.
const MALFORMED_PARAM_PATTERN = /[\s\p{Cc}?#/\\%;&=<>"'`{}|^[\]]/u;

export default function isMalformedRouteParam(param) {
  if (Array.isArray(param)) {
    return param.some(isMalformedRouteParam);
  }

  if (typeof param !== "string") {
    return false;
  }

  return param === "." || param === ".." || MALFORMED_PARAM_PATTERN.test(param);
}

export function hasMalformedRouteParam(params) {
  return Object.values(params || {}).some(isMalformedRouteParam);
}
