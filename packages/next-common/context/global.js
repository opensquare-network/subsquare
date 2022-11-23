import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import SettingsProvider from "./settings";
import ThemeModeProvider from "./theme";

export default function GlobalProvider({
  user,
  chain,
  homeFoldedMenus,
  themeMode,
  children,
}) {
  return (
    <ThemeModeProvider defaultThemeMode={themeMode}>
      <ChainProvider chain={chain}>
        <UserProvider user={user}>
          <SettingsProvider homeFoldItems={homeFoldedMenus}>
            {children}
          </SettingsProvider>
        </UserProvider>
      </ChainProvider>
    </ThemeModeProvider>
  );
}
