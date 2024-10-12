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
import WagmiProvider from "./wagmi";
import ReactQueryClientProvider from "./reactQuery";

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
    <ChainProvider chain={chain}>
      <WagmiProvider>
        <ReactQueryClientProvider>
          <ThemeModeProvider defaultThemeMode={themeMode}>
            <UserProvider user={user} userStatus={userStatus}>
              <ConnectedAccountProvider connectedAccount={connectedAccount}>
                <AdminProvider admins={admins}>
                  <NavProvider
                    navCollapsed={navCollapsed}
                    navSubmenuVisible={navSubmenuVisible}
                  >
                    <PageProvider pageProperties={pageProperties}>
                      <ApiProvider>
                        <SignetContextProvider>
                          {children}
                        </SignetContextProvider>
                      </ApiProvider>
                    </PageProvider>
                  </NavProvider>
                </AdminProvider>
              </ConnectedAccountProvider>
            </UserProvider>
          </ThemeModeProvider>
        </ReactQueryClientProvider>
      </WagmiProvider>
    </ChainProvider>
  );
}
