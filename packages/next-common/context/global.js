import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import SettingsProvider from "./settings";
import ThemeModeProvider from "./theme";
import PageProvider from "./page";

export default function GlobalProvider({
  user,
  chain,
  homeFoldedMenus,
  themeMode,
  children,
  pageProperties,
}) {
  return (
    <ThemeModeProvider defaultThemeMode={themeMode}>
      <ChainProvider chain={chain}>
        <UserProvider user={user}>
          <SettingsProvider homeFoldItems={homeFoldedMenus}>
            <PageProvider pageProperties={pageProperties}>
              {children}
            </PageProvider>
          </SettingsProvider>
        </UserProvider>
      </ChainProvider>
    </ThemeModeProvider>
  );
}
