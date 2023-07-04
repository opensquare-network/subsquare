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
  return (
    <NavCollapsedProvider value={navCollpased}>
      <NavSubmenuVisibleProvider value={navSubmenuVisible}>
        {children}
      </NavSubmenuVisibleProvider>
    </NavCollapsedProvider>
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

function NavCollapsedProvider({ children, value }) {
  let collapsed;
  try {
    collapsed = JSON.parse(value);
  } catch (_) {
    /* empty */
  }

  return (
    <NavCollapsedContext.Provider value={collapsed}>
      {children}
    </NavCollapsedContext.Provider>
  );
}

function NavSubmenuVisibleProvider({ children, value }) {
  let submenuVisible = {};
  try {
    submenuVisible = JSON.parse(decodeURIComponent(value));
  } catch (error) {
    console.error(error);
  }

  return (
    <NavSubmenuVisibleContext.Provider value={submenuVisible}>
      {children}
    </NavSubmenuVisibleContext.Provider>
  );
}
