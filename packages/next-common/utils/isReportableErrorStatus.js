// Only a 5xx answer means the app itself failed. 4xx answers come from what the visitor
// asked for — Next.js replies 400 for a path it cannot decode, and 405 for a non-GET
// request to a static chunk, and scanners send plenty of both — so reporting them only
// floods the error channel with noise nobody can act on.
export default function isReportableErrorStatus(statusCode) {
  if (statusCode === "" || statusCode === undefined || statusCode === null) {
    // A client-side exception carries no response status, and is always a real bug.
    return true;
  }

  const code = Number(statusCode);
  return Number.isNaN(code) || code >= 500;
}
