import React from "react";
import BaseLayout from "./baseLayout";
import Menu from "../menu";
import {
  settingMenu,
  settingMenuOfKeyAccount,
} from "../../utils/consts/menu/settings";
import { isKeyRegisteredUser } from "../../utils";
import { useUser } from "../../context/user";

export default function SettingsLayout({ children, seoInfo }) {
  const user = useUser();

  let menu = settingMenu;
  if (isKeyRegisteredUser(user)) {
    menu = settingMenuOfKeyAccount;
  }

  return (
    <BaseLayout seoInfo={seoInfo} left={<Menu menu={menu} />}>
      {children}
    </BaseLayout>
  );
}
