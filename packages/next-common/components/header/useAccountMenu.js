import React from "react";
import { SystemLogout, SystemSetting } from "@osn/icons/subsquare";
import { useIsLoggedIn, useIsWeb3User } from "next-common/context/user";

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

export const useAccountMenu = () => {
  const isLoggedIn = useIsLoggedIn();
  const isWeb3User = useIsWeb3User();
  if (isWeb3User) {
    return [web3AccountItem, disconnectItem];
  } else if (!isLoggedIn) {
    return [web2AccountItem, disconnectItem];
  } else {
    return [web2AccountItem, logoutItem];
  }
};
