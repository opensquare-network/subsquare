import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { createContext, useContext } from "react";

const NavCollapsedContext = createContext([]);
const NavSubmenuVisibleContext = createContext([]);

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

function NavSubmenuVisibleProvider({ children, value = {} }) {
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

export default function NavProvider({
  navCollapsed,
  navSubmenuVisible,
  children,
}) {
  return (
    <NavCollapsedProvider value={navCollapsed}>
      <NavSubmenuVisibleProvider value={navSubmenuVisible}>
        {children}
      </NavSubmenuVisibleProvider>
    </NavCollapsedProvider>
  );
}

export function useNavSubmenuVisible() {
  return useContext(NavSubmenuVisibleContext);
}

export function useNavCollapsed() {
  return useContext(NavCollapsedContext);
}
