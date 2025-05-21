const disabledApiRoutes = [/^\/api\/gov2\/referendums/];

function trimEndSlash(url) {
  return url.replace(/\/+$/, "");
}

export function isApiDisabled(req) {
  // If the request referer is from subsquare frontend, we don't need to check the disabledApiRoutes
  if (
    req.headers.referer.startsWith(
      trimEndSlash(process.env.NEXT_PUBLIC_API_END_POINT),
    )
  ) {
    console.warn(
      "Unexpected disabled api request from subsquare frontend, please check!",
    );
    return false;
  }

  return !disabledApiRoutes.every((route) => !req.url.match(route));
}
