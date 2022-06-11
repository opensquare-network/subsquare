import menus from "./consts/menus";
import Chains from "./consts/chains";
import polkadot from "./consts/settings/polkadot";
import kusama from "./consts/settings/kusama";
import crab from "./consts/settings/crab";
import karura from "./consts/settings/karura";
import bifrost from "./consts/settings/bifrost";
import acala from "./consts/settings/acala";
import calamari from "./consts/settings/calamari";
import crust from "./consts/settings/crust";
import interlay from "./consts/settings/interlay";
import kintsugi from "./consts/settings/kintsugi";
import khala from "./consts/settings/khala";
import polkadex from "./consts/settings/polkadex";
import turing from "./consts/settings/turing";
import basilisk from "./consts/settings/basilisk";

export const nodes = [
  polkadot,
  kusama,
  karura,
  acala,
  khala,
  {
    value: "kabocha",
    name: "Kabocha",
    icon: "kabocha.svg",
    hideHeight: true,
    // identity: "kabocha",
    // symbol: "",
    // decimals: 0,
    // hasElections: true,
  },
  bifrost,
  // basilisk,
  kintsugi,
  interlay,
  polkadex,
  crust,
  calamari,
  turing,
  crab,
];

export const accountMenu = [
  {
    value: "settings",
    name: "Settings",
    icon: "settings.svg",
    pathname: "/setting/account",
  },
  {
    value: "logout",
    name: "Logout",
    icon: "logout.svg",
  },
];

export const accountMenuForKeyAccount = [
  {
    value: "settings",
    name: "Settings",
    icon: "settings.svg",
    pathname: "/setting/key-account",
  },
  {
    value: "logout",
    name: "Logout",
    icon: "logout.svg",
  },
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
      },
      {
        value: "linked-address",
        name: "Linked Address",
        pathname: "/setting/linked-address",
      },
      {
        value: "notification",
        name: "Notification",
        pathname: "/setting/notification",
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
      },
      {
        value: "notification",
        name: "Notification",
        pathname: "/setting/notification",
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

export const SS58Prefix = {
  polkadot: 0,
  kusama: 2,
  karura: 8,
  acala: 10,
  khala: 30,
  substrate: 42,
  basilisk: 10041,
  kabocha: 27,
  bifrost: 6,
  kintsugi: 2092,
  polkadex: 88,
  [Chains.interlay]: 2032,
  [Chains.crust]: 66,
  [Chains.calamari]: 78,
  [Chains.turing]: 51,
  [Chains.crab]: 42,
};

export const defaultNodes = {
  [Chains.polkadot]: polkadot.endpoints,
  kusama: kusama.endpoints,
  karura: karura.endpoints,
  acala: acala.endpoints,
  khala: khala.endpoints,
  basilisk: basilisk.endpoints,
  bifrost: bifrost.endpoints,
  kintsugi: kintsugi.endpoints,
  polkadex: polkadex.endpoints,
  [Chains.interlay]: interlay.endpoints,
  [Chains.crust]: crust.endpoints,
  [Chains.calamari]: calamari.endpoints,
  [Chains.turing]: turing.endpoints,
  [Chains.crab]: crab.endpoints,
};

export const ChainBlockTime = {
  [Chains.polkadot]: 6000,
  [Chains.kusama]: 6000,
  [Chains.crust]: 6000,
  [Chains.crab]: 6000,
};

export const defaultBlockTime = 12000;

export const DEFAULT_SEO_INFO = {
  title: `SubSquare`,
  desc: `A platform that scans and normalizes the blockchain governance data. It enables community members to propose, vote proposals and discuss the corresponding topics.`,
};
