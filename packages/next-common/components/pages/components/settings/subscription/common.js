export function checkSubMenu(menus, menuName) {
  const menu = menus?.find((item) => item.name === menuName);
  const isMenuActive = menu && !menu?.archived;
  return { isMenuActive, menu };
}
