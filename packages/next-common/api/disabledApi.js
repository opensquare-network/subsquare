const disabledApiRoutes = [
  /^\/api\/gov2\/referendums/,
  /^\/api\/democracy/,
  /^\/api\/treasury/,
  /^\/api\/motions/, // Council Motions
  /^\/api\/ambassador/, // Ambassador
  /^\/api\/tech-comm/, // Technical Committee
  /^\/api\/alliance/, // Alliance
  /^\/api\/inancial-motions/,
  /^\/api\/advisory-motions/,
  /^\/api\/polkassembly-discussions/,
];

function trimEndSlash(url) {
  return url.replace(/\/+$/, "");
}

export function isApiDisabled(req) {
  if (req.method !== "GET") {
    return false;
  }
  const isDisabledApi = disabledApiRoutes.some((route) =>
    req.url?.match?.(route),
  );
  if (!isDisabledApi) {
    return false;
  }

  const isRequestFromSubsquare = req.headers?.referer?.startsWith?.(
    trimEndSlash(process.env.NEXT_PUBLIC_API_END_POINT),
  );
  if (isRequestFromSubsquare) {
    console.error(
      "ERROR: Unexpected disabled api request from subsquare frontend, please check!",
    );
    return false;
  }

  return true;
}
