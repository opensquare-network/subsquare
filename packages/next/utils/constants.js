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

export const DEFAULT_KARURA_NODE_URL = "wss://pub.elara.patract.io/karura";
export const DEFAULT_KARURA_NODES = [
  {
    name: "Patract Elara",
    url: "wss://pub.elara.patract.io/karura",
  },
  {
    name: "OnFinality",
    url: "wss://karura.api.onfinality.io/public-ws",
  },
  {
    name: "Polkawallet",
    url: "wss://karura.polkawallet.io",
  },
  {
    name: "Acala Foundation",
    url: "wss://karura-rpc-0.aca-api.network",
  },
];

export const nodes = [
  {
    value: "kusama",
    name: "Kusama",
    icon: "kusama.svg",
    relay: "kusama",
    symbol: "KSM",
    decimals: 12,
  },
  {
    value: "karura",
    name: "Karura",
    icon: "karura.svg",
    relay: "kusama",
    symbol: "KAR",
    decimals: 12,
  },
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

export const mainMenu = [
  {
    items: [
      {
        value: "overview",
        name: "Overview",
        icon: "type-overview.svg",
        pathname: "/[chain]",
      },
      {
        value: "discussions",
        name: "Discussions",
        icon: "type-discussions.svg",
        pathname: "/[chain]/discussions",
      },
    ],
  },
  {
    name: "TREASURY",
    items: [
      {
        value: "proposals",
        name: "Proposals",
        icon: "type-proposals.svg",
        pathname: "/[chain]/treasury/proposals",
      },
      {
        value: "tips",
        name: "Tips",
        icon: "type-tips.svg",
        pathname: "/[chain]/treasury/tips",
      },
    ],
  },
  {
    name: "DEMOCRACY",
    items: [
      {
        value: "democracyProposals",
        name: "Proposals",
        pathname: "/[chain]/democracy/proposals",
      },
      {
        value: "democracyExternals",
        name: "External",
        pathname: "/[chain]/democracy/externals",
      },
      {
        value: "referenda",
        name: "Referenda",
        icon: "type-referenda.svg",
        pathname: "/[chain]/democracy/referendums",
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
        pathname: "/[chain]/council/motions",
      },
    ],
  },
  {
    name: "TECH.COMM.",
    items: [
      {
        value: "techCommProposals",
        name: "Proposals",
        icon: "type-proposals.svg",
        pathname: "/[chain]/techcomm/proposals",
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
        pathname: "/[chain]",
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
  substract: 42,
};
