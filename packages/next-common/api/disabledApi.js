const disabledApiRoutes = [
  { route: /^\/api\/gov2\/referendums/, permanent: true },
  { route: /^\/api\/gov2\/tracks/ },
  { route: /^\/api\/democracy/ },
  { route: /^\/api\/treasury/ },
  { route: /^\/api\/motions/ }, // Council Motions
  { route: /^\/api\/ambassador/ }, // Ambassador
  { route: /^\/api\/tech-comm/ }, // Technical Committee
  { route: /^\/api\/alliance/ }, // Alliance
  { route: /^\/api\/financial-motions/ },
  { route: /^\/api\/advisory-motions/ },
  { route: /^\/api\/polkassembly-discussions/ },
  { route: /^\/api\/fellowship/ },
  { route: /^\/api\/overview/ },
];

function trimEndSlash(url) {
  if (!url) {
    return "";
  }
  return url.replace(/\/+$/, "");
}

function requireEnv(varName) {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Environment variable ${varName} is required but not set.`);
  }
  return value;
}

function isFromSubsquare(req) {
  const referer = req.headers?.referer;
  if (!referer) {
    return false;
  }

  try {
    return (
      new URL(referer).origin ===
      trimEndSlash(requireEnv("NEXT_PUBLIC_API_END_POINT"))
    );
  } catch {
    return false;
  }
}

export function isApiDisabled(req) {
  if (req.method !== "GET") {
    return false;
  }
  const disableRoute = disabledApiRoutes.find(({ route }) =>
    req.url?.match?.(route),
  );
  if (!disableRoute) {
    return false;
  }
  if (disableRoute.permanent) {
    return true;
  }

  const isRequestFromSubsquare = isFromSubsquare(req);
  if (isRequestFromSubsquare) {
    console.error(
      "ERROR: Unexpected disabled api request from subsquare frontend, please check!",
    );
    return false;
  }

  return true;
}
