import React from "react";
import UserIcon from "../../../assets/imgs/icons/user.svg";
import ProxyIcon from "../../../assets/imgs/icons/proxy.svg";
import BellIcon from "../../../assets/imgs/icons/bell.svg";
import SubscriptionIcon from "../../../assets/imgs/icons/subscription.svg";
import AddressIcon from "../../../assets/imgs/icons/address.svg";
import Chains from "../chains";

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
  pathname: "/setting/account",
  icon: <UserIcon />,
};

const keyAccountSetting = {
  ...accountSetting,
  pathname: "/setting/key-account",
};

const notificationSetting = {
  value: "notification",
  name: "Notification",
  pathname: "/setting/notification",
  icon: <BellIcon />,
};

const subscriptionSetting = {
  value: "subscription",
  name: "Subscription",
  pathname: "/setting/subscription",
  icon: <SubscriptionIcon />,
};

const linkAddressSetting = {
  value: "linked-address",
  name: "Linked Address",
  pathname: "/setting/linked-address",
  icon: <AddressIcon />,
};

const proxySetting = {
  value: "proxy",
  name: "Proxy",
  pathname: "/setting/proxy",
  icon: <ProxyIcon />,
  excludeToChains: [Chains.kintsugi],
};

export const settingMenuOfKeyAccount = [
  back,
  {
    name: "SETTING",
    items: [
      keyAccountSetting,
      proxySetting,
      notificationSetting,
      subscriptionSetting,
    ],
  },
];

export const settingMenu = [
  back,
  {
    name: "SETTING",
    items: [
      accountSetting,
      linkAddressSetting,
      notificationSetting,
      subscriptionSetting,
    ],
  },
];
