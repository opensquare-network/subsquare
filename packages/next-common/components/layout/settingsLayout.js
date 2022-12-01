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
  const menu = isKeyRegisteredUser(user)
    ? settingMenuOfKeyAccount
    : settingMenu;

  return (
    <BaseLayout seoInfo={seoInfo} left={<Menu menu={menu} />}>
      {children}
    </BaseLayout>
  );
}
