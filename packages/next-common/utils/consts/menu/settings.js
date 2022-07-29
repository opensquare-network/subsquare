import UserIcon from "../../../assets/imgs/icons/user.svg";
import BellIcon from "../../../assets/imgs/icons/bell.svg";
import React from "react";
import AddressIcon from "../../../assets/imgs/icons/address.svg";

const back = {
  items: [
    {
      value: "overview",
      name: "Back to Overview",
      pathname: "/",
    },
  ],
};

const accountSetting = {
  value: "account",
  name: "Account",
  pathname: "/setting/key-account",
  icon: <UserIcon />,
};

const notificationSetting = {
  value: "notification",
  name: "Notification",
  pathname: "/setting/notification",
  icon: <BellIcon />,
};

export const settingMenuOfKeyAccount = [
  back,
  {
    name: "SETTING",
    items: [accountSetting, notificationSetting],
  },
];

export const settingMenu = [
  back,
  {
    name: "SETTING",
    items: [
      accountSetting,
      {
        value: "linked-address",
        name: "Linked Address",
        pathname: "/setting/linked-address",
        icon: <AddressIcon />,
      },
      notificationSetting,
    ],
  },
];
