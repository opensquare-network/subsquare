const disabledApiRoutes = [/^\/api\/gov2\/referendums/];

export function isApiDisabled(req) {
  return disabledApiRoutes.some((route) => req.url?.match?.(route));
}
