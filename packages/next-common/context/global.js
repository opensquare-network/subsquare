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
import UserAccountProvider from "./user/account";
import PageLoadingProvider from "./pageLoading";
import WalletConnectProvider from "./walletconnect";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { PolkadotVaultProvider } from "./polkadotVault";
import WindowSizeProvider from "./windowSize";

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
  pathname,
}) {
  return (
    <WindowSizeProvider>
      <WagmiProvider>
        <ReactQueryClientProvider>
          <ThemeModeProvider defaultThemeMode={themeMode}>
            <ChainProvider chain={chain}>
              <UserProvider user={user} userStatus={userStatus}>
                <PageLoadingProvider>
                  <AdminProvider admins={admins}>
                    <NavProvider
                      navCollapsed={navCollapsed}
                      navSubmenuVisible={navSubmenuVisible}
                      pathname={pathname}
                    >
                      <PageProvider pageProperties={pageProperties}>
                        <ApiProvider>
                          <MigrationConditionalApiProvider>
                            <ConnectedAccountProvider
                              connectedAccount={connectedAccount}
                            >
                              <PolkadotVaultProvider>
                                <WalletConnectProvider>
                                  <UserAccountProvider>
                                    <SignetContextProvider>
                                      {children}
                                    </SignetContextProvider>
                                  </UserAccountProvider>
                                </WalletConnectProvider>
                              </PolkadotVaultProvider>
                            </ConnectedAccountProvider>
                          </MigrationConditionalApiProvider>
                        </ApiProvider>
                      </PageProvider>
                    </NavProvider>
                  </AdminProvider>
                </PageLoadingProvider>
              </UserProvider>
            </ChainProvider>
          </ThemeModeProvider>
        </ReactQueryClientProvider>
      </WagmiProvider>
    </WindowSizeProvider>
  );
}
