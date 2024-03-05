import { CACHE_KEY } from "next-common/utils/constants";

export default function getNavSubMenuVisible(cookies) {
  const navSubmenuVisible = cookies.get(CACHE_KEY.navSubmenuVisible);
  if (!navSubmenuVisible) {
    return;
  }
  try {
    return JSON.parse(decodeURIComponent(navSubmenuVisible));
  } catch (e) {
    return;
  }
}
