import React from "react";
import ChainProvider from "./chain";
import UserProvider from "./user";
import SettingsProvider from "./settings";

export default function GlobalProvider({
  user,
  chain,
  homeFoldedMenus,
  children,
}) {
  return (
    <ChainProvider chain={chain}>
      <UserProvider user={user}>
        <SettingsProvider homeFoldItems={homeFoldedMenus}>
          {children}
        </SettingsProvider>
      </UserProvider>
    </ChainProvider>
  );
}
