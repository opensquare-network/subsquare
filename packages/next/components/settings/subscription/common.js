export function checkSubMenu(menus, menuName) {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const menu = menus?.find((item) => item.name === menuName);
  const hasMenu = menu && !menu.excludeToChains?.includes(chain);
  return { hasMenu, menu };
}
