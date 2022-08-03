import React from "react";
import BaseLayout from "./baseLayout";
import Menu from "../menu";
import {
  settingMenu,
  settingMenuOfKeyAccount,
} from "../../utils/consts/menu/settings";
import { isKeyRegisteredUser } from "../../utils";

export default function SettingsLayout({ user, children, seoInfo }) {
  const menu = isKeyRegisteredUser(user)
    ? settingMenuOfKeyAccount
    : settingMenu;

  return (
    <BaseLayout
      user={user}
      children={children}
      seoInfo={seoInfo}
      left={<Menu menu={menu} chain={process.env.NEXT_PUBLIC_CHAIN} />}
    />
  );
}
