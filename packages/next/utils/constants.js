export const DEFAULT_KUSAMA_NODE_URL = "wss://pub.elara.patract.io/kusama";
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
    name: "Patract",
    url: "wss://pub.elara.patract.io/kusama",
  },
];

export const DEFAULT_KARURA_NODE_URL = "wss://pub.elara.patract.io/karura";
export const DEFAULT_KARURA_NODES = [
  {
    name: "Patract",
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
    name: "Acala",
    url: "wss://karura-rpc-0.aca-api.network",
  },
];

export const DEFAULT_KHALA_NODE_URL = "wss://khala.api.onfinality.io/public-ws";
export const DEFAULT_KHALA_NODES = [
  {
    name: "OnFinality",
    url: "wss://khala.api.onfinality.io/public-ws",
  },
];

export const DEFAULT_BASILISK_NODE_URL =
  "wss://basilisk.api.onfinality.io/public-ws";
export const DEFAULT_BASILISK_NODES = [
  {
    name: "OnFinality",
    url: "wss://basilisk.api.onfinality.io/public-ws",
  },
  {
    name: "HydraDX",
    url: "wss://rpc-01.basilisk.hydradx.io",
  },
];

export const DEFAULT_NODES = {
  kusama: DEFAULT_KUSAMA_NODE_URL,
  karura: DEFAULT_KARURA_NODE_URL,
  khala: DEFAULT_KHALA_NODE_URL,
  basilisk: DEFAULT_BASILISK_NODE_URL,
};

export const nodes = [
  ...(process.env.NEXT_PUBLIC_SHOW_KUSAMA === "true"
    ? [
        {
          value: "kusama",
          name: "Kusama",
          icon: "kusama.svg",
          identity: "kusama",
          symbol: "KSM",
          decimals: 12,
          hasElections: true,
        },
      ]
    : []),
  {
    value: "karura",
    name: "Karura",
    icon: "karura.svg",
    identity: "kusama",
    symbol: "KAR",
    decimals: 12,
    hasElections: false,
  },
  {
    value: "khala",
    name: "Khala",
    icon: "khala.svg",
    identity: "khala",
    symbol: "PHA",
    decimals: 12,
    hasElections: true,
  },
  {
    value: "basilisk",
    name: "Basilisk",
    icon: "basilisk.png",
    identity: "basilisk",
    symbol: "BSX",
    decimals: 12,
    hasElections: true,
    excludeMenus: ["bounties"],
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
        icon: "overview.svg",
        pathname: "/",
      },
      {
        value: "discussions",
        name: "Discussions",
        icon: "discussions.svg",
        pathname: "/discussions",
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
        pathname: "/treasury/proposals",
      },
      {
        value: "bounties",
        name: "Bounties",
        icon: "bounties.svg",
        pathname: "/treasury/bounties",
      },
      {
        value: "tips",
        name: "Tips",
        icon: "tips.svg",
        pathname: "/treasury/tips",
      },
    ],
  },
  {
    name: "DEMOCRACY",
    items: [
      {
        value: "democracyProposals",
        name: "Proposals",
        icon: "proposals.svg",
        pathname: "/democracy/proposals",
      },
      {
        value: "democracyExternals",
        name: "External",
        icon: "proposals.svg",
        pathname: "/democracy/externals",
      },
      {
        value: "referenda",
        name: "Referenda",
        icon: "type-referenda.svg",
        pathname: "/democracy/referendums",
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
        pathname: "/council/motions",
      },
      {
        value: "councilMembers",
        name: "Members",
        icon: "members.svg",
        pathname: "/council/members",
      },
    ],
  },
  {
    name: "TECH.COMM.",
    items: [
      {
        value: "techCommProposals",
        name: "Proposals",
        icon: "proposals.svg",
        pathname: "/techcomm/proposals",
      },
      {
        value: "techCommMembers",
        name: "Members",
        icon: "members.svg",
        pathname: "/techcomm/members",
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
  khala: 30,
  substrate: 42,
  basilisk: 10041,
};
