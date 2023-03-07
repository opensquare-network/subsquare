import React from "react";
import Settings from "../../assets/imgs/icons/settings.svg";
import Profile from "../../assets/imgs/icons/profile.svg";
import Logout from "../../assets/imgs/icons/logout.svg";

const logoutSetting = {
  value: "logout",
  name: "Logout",
  icon: <Logout />,
};

const profileSetting = {
  value: "profile",
  name: "Profile",
  icon: <Profile />,
  pathname: "/user/profile",
};

export const accountMenu = [
  profileSetting,
  {
    value: "settings",
    name: "Settings",
    icon: <Settings />,
    pathname: "/setting/account",
  },
  logoutSetting,
];

export const accountMenuForKeyAccount = [
  profileSetting,
  {
    value: "settings",
    name: "Settings",
    icon: <Settings />,
    pathname: "/setting/key-account",
  },
  logoutSetting,
];
