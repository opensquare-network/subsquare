import React from "react";
import { SystemLogout, SystemSetting } from "@osn/icons/subsquare";

const logoutItem = {
  value: "logout",
  name: "Logout",
  icon: <SystemLogout className="[&_path]:fill-textSecondary" />,
};

const web2AccountItem = {
  value: "settings",
  name: "Settings",
  icon: <SystemSetting className="[&_path]:stroke-textSecondary" />,
  pathname: "/settings/account",
};

const web3AccountItem = {
  value: "settings",
  name: "Settings",
  icon: <SystemSetting className="[&_path]:stroke-textSecondary" />,
  pathname: "/settings/key-account",
};

export const accountMenu = [web2AccountItem, logoutItem];

export const accountMenuForKeyAccount = [web3AccountItem, logoutItem];
