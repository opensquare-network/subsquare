export const DEFAULT_KUSAMA_NODE_URL = "wss://kusama.elara.patract.io";
export const DEFAULT_KUSAMA_NODES = [
  {
    name: "Parity",
    url: "wss://kusama-rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://kusama.api.onfinality.io/public-ws",
  },
  {
    name: "Patract Elara",
    url: "wss://kusama.elara.patract.io",
  },
];

export const DEFAULT_POLKADOT_NODE_URL = "wss://rpc.polkadot.io/";
export const DEFAULT_POLKADOT_NODES = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io/",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Patract Elara",
    url: "wss://polkadot.elara.patract.io/",
  },
];

export const nodes = [
  // {
  //   value: "kusama",
  //   name: "Kusama",
  //   icon: "kusama.svg",
  // },
  // {
  //   value: "polkadot",
  //   name: "Polkadot",
  //   icon: "polkadot.svg",
  // },
  {
    value: "karura",
    name: "Karura",
    icon: "karura.svg",
  },
];

export const accountMenu = [
  {
    value: "notifications",
    name: "Notifications",
    icon: "notifications.svg",
    pathname: "/setting/notification",
  },
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

export const mainMenu = [
  {
    items: [
      {
        value: "overview",
        name: "Overview",
        icon: "type-overview.svg",
        pathname: "/",
      },
      {
        value: "discussions",
        name: "Discussions",
        icon: "type-discussions.svg",
        pathname: "/discussions",
      },
    ],
  },
  {
    name: "DEMOCRACY",
    items: [
      {
        value: "proposals",
        name: "Proposals",
        icon: "type-proposals.svg",
      },
      {
        value: "external",
        name: "Externals",
        icon: "type-proposals.svg",
      },
      {
        value: "referenda",
        name: "Referenda",
        icon: "type-referenda.svg",
      },
    ],
  },
  {
    name: "TREASURY",
    items: [
      {
        value: "proposals",
        name: "Proposals",
        icon: "type-treasury-proposals.svg",
      },
      {
        value: "bounties",
        name: "Bounties",
        icon: "type-bounties.svg",
      },
      {
        value: "tips",
        name: "Tips",
        icon: "type-tips.svg",
      },
    ],
  },
  {
    name: "COUNCIL",
    items: [
      {
        value: "motions",
        name: "Motions",
        icon: "type-motions.svg",
      },
    ],
  },
];

export const settingMenu = [
  {
    items: [
      {
        value: "overview",
        name: "Back to Overview",
        icon: "type-overview.svg",
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
        icon: "setting-account.svg",
        pathname: "/setting/account",
      },
      {
        value: "linked-address",
        name: "Linked Address",
        icon: "setting-linked-address.svg",
        pathname: "/setting/linked-address",
      },
      {
        value: "notification",
        name: "Notification",
        icon: "setting-notification.svg",
        pathname: "/setting/notification",
      },
    ],
  },
];
