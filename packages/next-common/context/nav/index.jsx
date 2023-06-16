import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { createContext, useContext } from "react";

const NavCollapsedContext = createContext({});
const NavSubmenuVisibleContext = createContext({});

export default function NavProvider({
  navCollpased,
  navSubmenuVisible = "{}",
  children,
}) {
  let collapsed;
  try {
    collapsed = JSON.parse(navCollpased);
  } catch (_) {
    /* empty */
  }

  let submenuCollapsed;
  try {
    submenuCollapsed = JSON.parse(navSubmenuVisible);
  } catch (_) {
    /* empty */
  }

  return (
    <NavCollapsedContext.Provider value={collapsed}>
      <NavSubmenuVisibleContext.Provider value={submenuCollapsed}>
        {children}
      </NavSubmenuVisibleContext.Provider>
    </NavCollapsedContext.Provider>
  );
}

export function useNavCollapsed() {
  const value = useContext(NavCollapsedContext);
  const [navCollapsed, setNavCollapsed] = useCookieValue(
    CACHE_KEY.navCollapsed,
    value,
  );
  return [navCollapsed, setNavCollapsed];
}

export function useNavSubmenuVisible() {
  const value = useContext(NavSubmenuVisibleContext);
  const [navSubmenuVisible, setNavSubmenuVisible] = useCookieValue(
    CACHE_KEY.navSubmenuVisible,
    value,
  );
  return [navSubmenuVisible, setNavSubmenuVisible];
}
