const disabledApiRoutes = [/^\/api\/gov2\/referendums/];

function trimEndSlash(url) {
  return url.replace(/\/+$/, "");
}

export function isApiDisabled(req) {
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
