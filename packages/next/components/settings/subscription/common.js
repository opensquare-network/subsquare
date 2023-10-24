export function checkSubMenu(menus, menuName) {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const menu = menus?.find((item) => item.name === menuName);
  const isMenuActive =
    menu &&
    !menu.excludeToChains?.includes(chain) &&
    !menu.archivedToChains?.includes(chain);
  return { isMenuActive, menu };
}
