export function checkSubMenu(menus, menuName) {
  const menu = menus?.find((item) => item.name === menuName);
  const isMenuActive = menu;
  return { isMenuActive, menu };
}
