import { CACHE_KEY } from "next-common/utils/constants";

export default function getNavCollapsed(cookies) {
  const navCollapsed = cookies.get(CACHE_KEY.navCollapsed);
  if (!navCollapsed) {
    return;
  }
  try {
    return JSON.parse(decodeURIComponent(navCollapsed));
  } catch (e) {
    return;
  }
}
