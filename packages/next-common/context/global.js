import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import ThemeModeProvider from "./theme";
import PageProvider from "./page";
import NavProvider from "./nav";
import { SocketProvider } from "./socket";
import { AdminProvider } from "./admin";
import { ConnectedAccountProvider } from "./connectedAccount";

export default function GlobalProvider({
  user,
  userStatus,
  admins,
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
          <UserProvider user={user} userStatus={userStatus}>
            <ConnectedAccountProvider>
              <AdminProvider admins={admins}>
                <NavProvider
                  navCollapsed={navCollapsed}
                  navSubmenuVisible={navSubmenuVisible}
                >
                  <PageProvider pageProperties={pageProperties}>
                    {children}
                  </PageProvider>
                </NavProvider>
              </AdminProvider>
            </ConnectedAccountProvider>
          </UserProvider>
        </ChainProvider>
      </ThemeModeProvider>
    </SocketProvider>
  );
}
