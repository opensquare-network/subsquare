export const EMPTY_SERVER_PROPS = { props: {} };

export function to404(context) {
  const { res } = context;
  res.statusCode = 302;
  res.setHeader("Location", `/404`);
  res.end();
  return EMPTY_SERVER_PROPS;
}

export function checkBrowserCompatibility(context) {
  const userAgent = context?.req?.headers["user-agent"] ?? "";
  const isSafari =
    userAgent.includes("Safari") && !userAgent.includes("Chrome");
  if (isSafari) {
    const regex = /\bVersion\/(\d+?\.\d+)/;
    const version = regex.exec(userAgent)?.[1];
    if (parseFloat(version) < 14) {
      toBrowserCompatibleError(context);
    }
  }
}

export function toBrowserCompatibleError(context) {
  const { res } = context;
  res.statusCode = 302;
  res.setHeader("Location", `/incompatible`);
  res.end();
}
