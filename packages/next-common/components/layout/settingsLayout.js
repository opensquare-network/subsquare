import React from "react";
import BaseLayout from "./baseLayout";
import Menu from "../menu";
import {
  settingMenu,
  settingMenuOfEthereumKeyAccount,
  settingMenuOfKeyAccount,
} from "../../utils/consts/menu/settings";
import { isEthereumKeyRegisteredUser, isPolkadotKeyRegisteredUser } from "../../utils";
import { useUser } from "../../context/user";

export default function SettingsLayout({ children, seoInfo }) {
  const user = useUser();

  let menu = settingMenu;
  if (isPolkadotKeyRegisteredUser(user)) {
    menu = settingMenuOfKeyAccount;
  } else if (isEthereumKeyRegisteredUser(user)) {
    menu = settingMenuOfEthereumKeyAccount;
  }

  return (
    <BaseLayout seoInfo={seoInfo} left={<Menu menu={menu} />}>
      {children}
    </BaseLayout>
  );
}
