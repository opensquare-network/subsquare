import { CACHE_KEY, NAV_MENU_TYPE } from "next-common/utils/constants";
import { getMainMenu } from "next-common/utils/consts/menu";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { createContext, useContext, useMemo, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import { matchNewMenu } from "next-common/utils/consts/menu";

const NavCollapsedContext = createContext([]);
const NavSubmenuVisibleContext = createContext([]);
const NavMenuTypeContext = createContext([]);

export default function NavProvider({
  navCollapsed,
  navSubmenuVisible = "{}",
  pathname,
  children,
}) {
  return (
    <NavCollapsedProvider value={navCollapsed}>
      <NavSubmenuVisibleProvider value={navSubmenuVisible}>
        <NavMenuTypeProvider pathname={pathname}>
          {children}
        </NavMenuTypeProvider>
      </NavSubmenuVisibleProvider>
    </NavCollapsedProvider>
  );
}

export function useNavSubmenuVisible() {
  return useContext(NavSubmenuVisibleContext);
}
function NavCollapsedProvider({ children, value }) {
  try {
    value = JSON.parse(value);
  } catch (_) {
    /* empty */
  }
  const [navCollapsed, setNavCollapsed] = useCookieValue(
    CACHE_KEY.navCollapsed,
    value,
  );

  return (
    <NavCollapsedContext.Provider value={[navCollapsed, setNavCollapsed]}>
      {children}
    </NavCollapsedContext.Provider>
  );
}

export function useNavCollapsed() {
  return useContext(NavCollapsedContext);
}
function NavSubmenuVisibleProvider({ children, value }) {
  try {
    value = JSON.parse(decodeURIComponent(value));
  } catch (error) {
    console.error(error);
  }

  const [navSubmenuVisible, setNavSubmenuVisible] = useCookieValue(
    CACHE_KEY.navSubmenuVisible,
    value,
  );

  return (
    <NavSubmenuVisibleContext.Provider
      value={[navSubmenuVisible, setNavSubmenuVisible]}
    >
      {children}
    </NavSubmenuVisibleContext.Provider>
  );
}

const menu = getMainMenu();
export function useNavMenuType() {
  return useContext(NavMenuTypeContext);
}
function NavMenuTypeProvider({ pathname, children }) {
  const matchMenu = useMemo(() => {
    return (
      matchNewMenu(menu, pathname) || {
        type: NAV_MENU_TYPE.main,
        menu: null,
      }
    );
  }, [pathname]);
  const [navMenuType, setNavMenuType] = useState(matchMenu);

  useIsomorphicLayoutEffect(() => {
    setNavMenuType(matchMenu);
  }, [matchMenu]);

  return (
    <NavMenuTypeContext.Provider value={[navMenuType, setNavMenuType]}>
      {children}
    </NavMenuTypeContext.Provider>
  );
}
