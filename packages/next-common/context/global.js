import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import ThemeModeProvider from "./theme";
import PageProvider from "./page";
import NavProvider from "./nav";
import { SocketProvider } from "./socket";
import { ConnectedAddressProvider } from "./connectedAddress";

export default function GlobalProvider({
  user,
  chain,
  themeMode,
  children,
  pageProperties,
  navCollapsed,
  navSubmenuVisible,
}) {
  return (
    <SocketProvider>
      <ThemeModeProvider defaultThemeMode={themeMode}>
        <ChainProvider chain={chain}>
          <UserProvider user={user}>
            <ConnectedAddressProvider>
              <NavProvider
                navCollapsed={navCollapsed}
                navSubmenuVisible={navSubmenuVisible}
              >
                <PageProvider pageProperties={pageProperties}>
                  {children}
                </PageProvider>
              </NavProvider>
            </ConnectedAddressProvider>
          </UserProvider>
        </ChainProvider>
      </ThemeModeProvider>
    </SocketProvider>
  );
}
