import polkadot from "./consts/settings/polkadot";
import kusama from "./consts/settings/kusama";
import crab from "./consts/settings/crab";
import karura from "./consts/settings/karura";
import bifrost from "./consts/settings/bifrost";
import acala from "./consts/settings/acala";
import interlay from "./consts/settings/interlay";
import kintsugi from "./consts/settings/kintsugi";
import khala from "./consts/settings/khala";
import phala from "./consts/settings/phala";
import turing from "./consts/settings/turing";
// import kabocha from "./consts/settings/kabocha";
import crust from "./consts/settings/crust";
import litmus from "./consts/settings/litmus";
import menus from "./consts/menu";
import UserIcon from "../assets/imgs/icons/user.svg";
import React from "react";
import AddressIcon from "../assets/imgs/icons/address.svg";
import BellIcon from "../assets/imgs/icons/bell.svg";

export const nodes = [
  polkadot,
  kusama,
  karura,
  acala,
  khala,
  phala,
  // kabocha,
  bifrost,
  // basilisk,
  kintsugi,
  interlay,
  turing,
  crab,
  // centrifuge,
  crust,
  litmus,
];

export const mainMenu = menus;

export const settingMenu = [
  {
    items: [
      {
        value: "overview",
        name: "Back to Overview",
        pathname: "/",
      },
    ],
  },
  {
    name: "SETTING",
    items: [
      {
        value: "account",
        name: "Account",
        pathname: "/setting/account",
        icon: <UserIcon />,
      },
      {
        value: "linked-address",
        name: "Linked Address",
        pathname: "/setting/linked-address",
        icon: <AddressIcon />,
      },
      {
        value: "notification",
        name: "Notification",
        pathname: "/setting/notification",
        icon: <BellIcon />,
      },
    ],
  },
];

export const settingMenuOfKeyAccount = [
  {
    items: [
      {
        value: "overview",
        name: "Back to Overview",
        pathname: "/",
      },
    ],
  },
  {
    name: "SETTING",
    items: [
      {
        value: "account",
        name: "Account",
        pathname: "/setting/key-account",
        icon: <UserIcon />,
      },
      {
        value: "notification",
        name: "Notification",
        pathname: "/setting/notification",
        icon: <BellIcon />,
      },
    ],
  },
];

export const EmptyList = {
  total: 0,
  page: 1,
  pageSize: 10,
  items: [],
};

export const defaultBlockTime = 12000;

export const DEFAULT_SEO_INFO = {
  title: `SubSquare`,
  desc: `A platform that scans and normalizes the blockchain governance data. It enables community members to propose, vote proposals and discuss the corresponding topics.`,
};

export const BalanceDecimals = {
  DOT: 2,
  KSM: 2,
};
