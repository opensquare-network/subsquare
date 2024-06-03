import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import ThemeModeProvider from "./theme";
import PageProvider from "./page";
import NavProvider from "./nav";
import { AdminProvider } from "./admin";
import { ConnectedAccountProvider } from "./connectedAccount";
import ApiProvider from "next-common/context/api";
import { SignetContextProvider } from "./signet";
import { AssetHubApiProvider } from "./assetHub";

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
      <ChainProvider chain={chain}>
        <UserProvider user={user} userStatus={userStatus}>
          <ConnectedAccountProvider connectedAccount={connectedAccount}>
            <AdminProvider admins={admins}>
              <NavProvider
                navCollapsed={navCollapsed}
                navSubmenuVisible={navSubmenuVisible}
              >
                <PageProvider pageProperties={pageProperties}>
                  <ApiProvider>
                    <AssetHubApiProvider>
                      <SignetContextProvider>{children}</SignetContextProvider>
                    </AssetHubApiProvider>
                  </ApiProvider>
                </PageProvider>
              </NavProvider>
            </AdminProvider>
          </ConnectedAccountProvider>
        </UserProvider>
      </ChainProvider>
    </ThemeModeProvider>
  );
}
