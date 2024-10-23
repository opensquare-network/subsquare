import { find } from "lodash-es";
import { CACHE_KEY } from "next-common/utils/constants";
import { getMainMenu } from "next-common/utils/consts/menu";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { createContext, useContext } from "react";

const NavCollapsedContext = createContext([]);
const NavSubmenuVisibleContext = createContext([]);
const NavMenuViewContext = createContext({});

export default function NavProvider({
  navCollapsed,
  navSubmenuVisible = "{}",
  pathname,
  children,
}) {
  return (
    <NavCollapsedProvider value={navCollapsed}>
      <NavSubmenuVisibleProvider value={navSubmenuVisible}>
        <NavMenuViewProvider pathname={pathname}>
          {children}
        </NavMenuViewProvider>
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

export function useNavMenuView() {
  return useContext(NavMenuViewContext);
}
function NavMenuViewProvider({ pathname, children }) {
  const menu = getMainMenu();
  const matchedMenu = find(menu, { pathname });

  let navMenuView = { view: "main", menu: null };
  if (matchedMenu.type === "subspace") {
    navMenuView = {
      view: "subspace",
      menu: matchedMenu.items,
    };
  }

  return (
    <NavMenuViewContext.Provider value={navMenuView}>
      {children}
    </NavMenuViewContext.Provider>
  );
}
