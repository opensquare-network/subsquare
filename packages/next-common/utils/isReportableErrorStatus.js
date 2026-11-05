// 4xx responses are client errors: missing pages, malformed urls, path traversal attempts,
// blocked requests, … They are rejected before routing or come from what the visitor asked
// for — Next.js replies 400 for a path it cannot decode and 405 for a non-GET request to a
// static chunk — so reporting them only adds noise nobody can act on. Keep reporting 5xx
// and browser-side errors, which do mean the app itself failed.
export default function isReportableErrorStatus(statusCode) {
  if (statusCode === "" || statusCode === undefined || statusCode === null) {
    // A client-side exception carries no response status, and is always a real bug.
    return true;
  }

  const code = Number(statusCode);
  return Number.isNaN(code) || code >= 500;
}
