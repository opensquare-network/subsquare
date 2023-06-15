import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { createContext, useContext } from "react";

const NavCollapsedContext = createContext({});

export default function NavProvider({ navCollpased, children }) {
  let collapsed;
  try {
    collapsed = JSON.parse(navCollpased);
  } catch (_) {
    /* empty */
  }

  return (
    <NavCollapsedContext.Provider value={collapsed}>
      {children}
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
