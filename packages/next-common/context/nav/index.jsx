import { find, some } from "lodash-es";
import { CACHE_KEY, NAV_MENU_TYPE } from "next-common/utils/constants";
import { getMainMenu } from "next-common/utils/consts/menu";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { createContext, useCallback, useContext, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

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

const isSubSpaceNavMenu = (type) => type === NAV_MENU_TYPE.subspace;

const menu = getMainMenu();
export function useNavMenuType() {
  return useContext(NavMenuTypeContext);
}
function NavMenuTypeProvider({ pathname, children }) {
  const firstPath = "/" + pathname?.split("/").filter(Boolean)[0];

  const getMatchedMenuType = useCallback(
    (p) => {
      const matchedMenu = find(menu, (m) => {
        let matched = m.pathname === p;
        if (!matched && m?.items?.length) {
          matched = some(m?.items, { pathname: p });

          if (isSubSpaceNavMenu(m?.type) && m.pathname === firstPath) {
            matched = true;
          }
        }

        return matched;
      });
      if (isSubSpaceNavMenu(matchedMenu?.type)) {
        return {
          type: NAV_MENU_TYPE.subspace,
          menu: matchedMenu.items,
        };
      }

      return { type: NAV_MENU_TYPE.main, menu: null };
    },
    [firstPath],
  );

  const [navMenuType, setNavMenuType] = useState(getMatchedMenuType(pathname));

  useIsomorphicLayoutEffect(() => {
    if (navMenuType.type !== NAV_MENU_TYPE.archived) {
      setNavMenuType(getMatchedMenuType(pathname));
    }
  }, [getMatchedMenuType, pathname]);

  return (
    <NavMenuTypeContext.Provider value={[navMenuType, setNavMenuType]}>
      {children}
    </NavMenuTypeContext.Provider>
  );
}
