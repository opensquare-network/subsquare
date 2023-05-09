import React from "react";
import UserIcon from "../../../assets/imgs/icons/user.svg";
import ProxyIcon from "../../../assets/imgs/icons/proxy.svg";
import BellIcon from "../../../assets/imgs/icons/bell.svg";
import SubscriptionIcon from "../../../assets/imgs/icons/subscription.svg";
import AddressIcon from "../../../assets/imgs/icons/address.svg";
import Chains from "../chains";
import MenuIconWrapper from "../../../components/icons/menuIconWrapper";

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
  icon: (
    <MenuIconWrapper>
      <UserIcon />
    </MenuIconWrapper>
  ),
};

const keyAccountSetting = {
  ...accountSetting,
  pathname: "/setting/key-account",
};

const notificationSetting = {
  value: "notification",
  name: "Notification",
  pathname: "/setting/notification",
  icon: (
    <MenuIconWrapper>
      <BellIcon />
    </MenuIconWrapper>
  ),
};

const subscriptionSetting = {
  value: "subscription",
  name: "Subscription",
  pathname: "/setting/subscription",
  excludeToChains: [Chains.collectives, Chains["westend-collectives"]],
  icon: (
    <MenuIconWrapper>
      <SubscriptionIcon />
    </MenuIconWrapper>
  ),
};

const linkAddressSetting = {
  value: "linked-address",
  name: "Linked Address",
  pathname: "/setting/linked-address",
  icon: (
    <MenuIconWrapper>
      <AddressIcon />
    </MenuIconWrapper>
  ),
};

const proxySetting = {
  value: "proxy",
  name: "Proxy",
  pathname: "/setting/proxy",
  excludeToChains: [Chains.kintsugi, Chains.interlay],
  icon: (
    <MenuIconWrapper>
      <ProxyIcon />
    </MenuIconWrapper>
  ),
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

export const settingMenuOfEthereumKeyAccount = [
  back,
  {
    name: "SETTING",
    items: [
      keyAccountSetting,
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
