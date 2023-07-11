import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import SettingsProvider from "./settings";
import ThemeModeProvider from "./theme";
import PageProvider from "./page";
import NavProvider from "./nav";
import { SocketProvider } from "./socket";

export default function GlobalProvider({
  user,
  chain,
  homeExpandedMenus,
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
            <SettingsProvider homeExpandedMenus={homeExpandedMenus}>
              <NavProvider
                navCollapsed={navCollapsed}
                navSubmenuVisible={navSubmenuVisible}
              >
                <PageProvider pageProperties={pageProperties}>
                  {children}
                </PageProvider>
              </NavProvider>
            </SettingsProvider>
          </UserProvider>
        </ChainProvider>
      </ThemeModeProvider>
    </SocketProvider>
  );
}
