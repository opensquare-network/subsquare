import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import ThemeModeProvider from "./theme";
import PageProvider from "./page";
import NavProvider from "./nav";
import { SocketProvider } from "./socket";
import { ConnectedAddressProvider } from "./connectedAddress";
import { AdminProvider } from "./admin";
import { ConnectedWalletProvider } from "./connectedWallet";

export default function GlobalProvider({
  connectedWallet,
  user,
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
          <ConnectedWalletProvider connectedWallet={connectedWallet}>
            <UserProvider user={user}>
              <AdminProvider admins={admins}>
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
              </AdminProvider>
            </UserProvider>
          </ConnectedWalletProvider>
        </ChainProvider>
      </ThemeModeProvider>
    </SocketProvider>
  );
}
