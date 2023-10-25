import React from "react";
import { SystemLogout, SystemSetting } from "@osn/icons/subsquare";

const logoutSetting = {
  value: "logout",
  name: "Logout",
  icon: <SystemLogout className="[&_path]:fill-textSecondary" />,
};

export const accountMenu = [
  {
    value: "settings",
    name: "Settings",
    icon: <SystemSetting className="[&_path]:stroke-textSecondary" />,
    pathname: "/settings/account",
  },
  logoutSetting,
];

export const accountMenuForKeyAccount = [
  {
    value: "settings",
    name: "Settings",
    icon: <SystemSetting className="[&_path]:stroke-textSecondary" />,
    pathname: "/settings/key-account",
  },
  logoutSetting,
];
