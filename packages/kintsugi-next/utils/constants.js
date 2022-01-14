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
export const DEFAULT_KUSAMA_NODE_URL = DEFAULT_KUSAMA_NODES[0]?.url;

export const DEFAULT_KARURA_NODES = [
  {
    name: "OnFinality",
    url: "wss://karura.api.onfinality.io/public-ws",
  },
  {
    name: "Polkawallet",
    url: "wss://karura.polkawallet.io",
  },
  {
    name: "Acala Foundation 0",
    url: "wss://karura-rpc-0.aca-api.network",
  },
  {
    name: "Acala Foundation 1",
    url: "wss://karura-rpc-1.aca-api.network",
  },
  {
    name: "Acala Foundation 2",
    url: "wss://karura-rpc-2.aca-api.network/ws",
  },
  {
    name: "Acala Foundation 3",
    url: "wss://karura-rpc-3.aca-api.network/ws",
  },
];
export const DEFAULT_KARURA_NODE_URL = DEFAULT_KARURA_NODES[0]?.url;

export const DEFAULT_KHALA_NODES = [
  {
    name: "OnFinality",
    url: "wss://khala.api.onfinality.io/public-ws",
  },
];
export const DEFAULT_KHALA_NODE_URL = DEFAULT_KHALA_NODES[0]?.url;

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
export const DEFAULT_BASILISK_NODE_URL = DEFAULT_BASILISK_NODES[0]?.url;

export const DEFAULT_BIFROST_NODES = [
  {
    name: "OnFinality",
    url: "wss://bifrost-parachain.api.onfinality.io/public-ws",
  },
  {
    name: "Liebi",
    url: "wss://bifrost-rpc.liebi.com/ws",
  },
];

export const DEFAULT_BIFROST_NODE_URL = DEFAULT_BIFROST_NODES[0]?.url;

export const DEFAULT_KINTSUGI_NODES = [
  {
    name: "OnFinality",
    url: "wss://kintsugi.api.onfinality.io/public-ws",
  },
  {
    name: "Kintsugi Labs",
    url: "wss://api-kusama.interlay.io/parachain",
  },
];

export const DEFAULT_KINTSUGI_NODE_URL = DEFAULT_KINTSUGI_NODES[0]?.url;

export const DEFAULT_NODES = {
  kusama: DEFAULT_KUSAMA_NODE_URL,
  karura: DEFAULT_KARURA_NODE_URL,
  khala: DEFAULT_KHALA_NODE_URL,
  basilisk: DEFAULT_BASILISK_NODE_URL,
  bifrost: DEFAULT_BIFROST_NODE_URL,
  kintsugi: DEFAULT_KINTSUGI_NODE_URL,
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
    value: "kabocha",
    name: "Kabocha",
    icon: "kabocha.svg",
    hideHeight: true,
  },
  {
    value: "bifrost",
    name: "Bifrost",
    icon: "bifrost.svg",
    hideHeight: false,
    identity: "bifrost",
    symbol: "bnc",
    decimals: 12,
    hasElections: true,
  },
  // {
  //   value: "basilisk",
  //   name: "Basilisk",
  //   icon: "basilisk.svg",
  //   identity: "basilisk",
  //   symbol: "BSX",
  //   decimals: 12,
  //   hasElections: true,
  // },
  {
    value: "kintsugi",
    name: "Kintsugi",
    icon: "kintsugi.png",
    identity: "kusama",
    symbol: "KINT",
    decimals: 12,
    hasElections: false,
  },
];

export const accountMenu = [
  {
    value: "settings",
    name: "Settings",
    icon: "settings.svg",
    pathname: "/settings/account",
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
        pathname: "/",
      },
      {
        value: "discussions",
        name: "Discussions",
        pathname: "/discussions",
      },
    ],
  },
  {
    name: "TREASURY",
    excludeToChains: ["kintsugi"],
    items: [
      {
        value: "proposals",
        name: "Proposals",
        pathname: "/treasury/proposals",
      },
    ],
  },
  {
    name: "DEMOCRACY",
    items: [
      {
        value: "democracyProposals",
        name: "Proposals",
        pathname: "/democracy/proposals",
      },
      {
        value: "referenda",
        name: "Referenda",
        pathname: "/democracy/referendums",
      },
    ],
  },
  {
    name: "TECH.COMM.",
    items: [
      {
        value: "techCommProposals",
        name: "Proposals",
        pathname: "/techcomm/proposals",
      },
      {
        value: "techCommMembers",
        name: "Members",
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
        pathname: "/settings/account",
      },
      {
        value: "linked-address",
        name: "Linked Address",
        pathname: "/settings/linked-address",
      },
      {
        value: "notification",
        name: "Notification",
        pathname: "/settings/notification",
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
  kabocha: 2,
  bifrost: 6,
  kintsugi: 2092,
};

export const TreasuryAccount =
  "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";
