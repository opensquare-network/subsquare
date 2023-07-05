import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import SettingsProvider from "./settings";
import ThemeModeProvider from "./theme";
import PageProvider from "./page";
import NavProvider from "./nav";
import { PostProvider } from "./post";

export default function GlobalProvider({
  user,
  chain,
  homeExpandedMenus,
  themeMode,
  children,
  pageProperties,
  navCollapsed,
  navSubmenuVisible,
  detail,
}) {
  return (
    <ThemeModeProvider defaultThemeMode={themeMode}>
      <ChainProvider chain={chain}>
        <UserProvider user={user}>
          <SettingsProvider homeExpandedMenus={homeExpandedMenus}>
            <NavProvider
              navCollpased={navCollapsed}
              navSubmenuVisible={navSubmenuVisible}
            >
              <PageProvider pageProperties={pageProperties}>
                <PostProvider post={detail}>{children}</PostProvider>
              </PageProvider>
            </NavProvider>
          </SettingsProvider>
        </UserProvider>
      </ChainProvider>
    </ThemeModeProvider>
  );
}
