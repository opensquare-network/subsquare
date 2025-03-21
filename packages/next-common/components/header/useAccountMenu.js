import React from "react";
import {
  SystemLogout,
  SystemSetting,
  SystemSwitch,
} from "@osn/icons/subsquare";
import { useIsLoggedIn, useIsWeb3User } from "next-common/context/user";

const switchAccountItem = {
  value: "switch",
  name: "Switch Account",
  icon: <SystemSwitch className="[&_path]:fill-textSecondary" />,
};

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

const settingsCommon = {
  value: "settings",
  name: "Settings",
  icon: <SystemSetting className="[&_path]:stroke-textSecondary" />,
};

const web2AccountItem = {
  ...settingsCommon,
  pathname: "/settings/account",
};

const web3AccountItem = {
  ...settingsCommon,
  pathname: "/settings/key-account",
};

export const useAccountMenu = () => {
  const isLoggedIn = useIsLoggedIn();
  const isWeb3User = useIsWeb3User();
  if (isWeb3User) {
    return [web3AccountItem, switchAccountItem, disconnectItem];
  } else if (!isLoggedIn) {
    // web2 account with binded address connected
    return [web2AccountItem, disconnectItem];
  } else {
    return [web2AccountItem, logoutItem];
  }
};
