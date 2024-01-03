import React from "react";
import { SystemLogout, SystemSetting } from "@osn/icons/subsquare";
import { isKeyRegisteredUser } from "next-common/utils";

const logoutItem = {
  value: "logout",
  name: "Logout",
  icon: <SystemLogout className="[&_path]:fill-textSecondary" />,
};

const disconnectItem = {
  value: "logout",
  name: "Disconnect",
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

export const getAccountMenu = (userContext) => {
  const { user, userStatus } = userContext;
  const isLoggedIn = userStatus?.isLoggedIn;
  const isWeb3User = isKeyRegisteredUser(user);
  if (isWeb3User || !isLoggedIn) {
    return [web3AccountItem, disconnectItem];
  }
  return [web2AccountItem, logoutItem];
};
