export function to404(context) {
  const { res } = context;
  res.statusCode = 302;
  res.setHeader("Location", `/404`);
  res.end();
}

export function isSafari(context) {
  const userAgent = context?.req?.headers["user-agent"] ?? "";
  const isSafari =
    userAgent.includes("Safari") && !userAgent.includes("Chrome");
  if (isSafari) {
    toSafariError(context);
  }
}

export function toSafariError(context) {
  const { res } = context;
  res.statusCode = 302;
  res.setHeader("Location", `/safari`);
  res.end();
}
