const disabledApiRoutes = [/^\/api\/gov2\/referendums/];

export function isApiDisabled(url) {
  return !disabledApiRoutes.every((route) => !url.match(route));
}
