import React from "react";
import Settings from "../../assets/imgs/icons/settings.svg";
import Logout from "../../assets/imgs/icons/logout.svg";

const logoutSetting = {
  value: "logout",
  name: "Logout",
  icon: <Logout />,
};

export const accountMenu = [
  {
    value: "settings",
    name: "Settings",
    icon: <Settings />,
    pathname: "/setting/account",
  },
  logoutSetting,
];

export const accountMenuForKeyAccount = [
  {
    value: "settings",
    name: "Settings",
    icon: <Settings />,
    pathname: "/setting/key-account",
  },
  logoutSetting,
];
