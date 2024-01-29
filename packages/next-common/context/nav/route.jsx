import React from "react";
import { useRouter } from "next/router";

export const RouteContext = React.createContext();

export default function NavRouteProvider({ children }) {
  const { pathname, asPath } = useRouter();
  return (
    <RouteContext.Provider value={{ pathname, url: asPath }}>
      {children}
    </RouteContext.Provider>
  );
}

export function usePathname() {
  const { pathname } = React.useContext(RouteContext);
  return pathname;
}

export function usePageUrl() {
  const { url } = React.useContext(RouteContext);
  return url;
}
