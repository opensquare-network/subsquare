import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import ThemeModeProvider, { StyledThemeValueProvider } from "./theme";
import PageProvider from "./page";
import NavProvider from "./nav";
import { AdminProvider } from "./admin";
import { ConnectedAccountProvider } from "./connectedAccount";
import NavRouteProvider from "./nav/route";

export default function GlobalProvider({
  user,
  userStatus,
  connectedAccount,
  admins,
  chain,
  themeMode,
  children,
  pageProperties,
  navCollapsed,
  navSubmenuVisible,
}) {
  return (
    <ThemeModeProvider defaultThemeMode={themeMode}>
      <StyledThemeValueProvider>
        <ChainProvider chain={chain}>
          <UserProvider user={user} userStatus={userStatus}>
            <ConnectedAccountProvider connectedAccount={connectedAccount}>
              <AdminProvider admins={admins}>
                <NavProvider
                  navCollapsed={navCollapsed}
                  navSubmenuVisible={navSubmenuVisible}
                >
                  <NavRouteProvider>
                    <PageProvider pageProperties={pageProperties}>
                      {children}
                    </PageProvider>
                  </NavRouteProvider>
                </NavProvider>
              </AdminProvider>
            </ConnectedAccountProvider>
          </UserProvider>
        </ChainProvider>
      </StyledThemeValueProvider>
    </ThemeModeProvider>
  );
}
