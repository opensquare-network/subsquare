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

export const DEFAULT_ACALA_NODES = [
  {
    name: "OnFinality",
    url: "wss://acala-polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Polkawallet",
    url: "wss://acala.polkawallet.io/",
  },
  {
    name: "Acala Foundation 0",
    url: "wss://acala-rpc-0.aca-api.network/",
  },
  {
    name: "Acala Foundation 1",
    url: "wss://acala-rpc-1.aca-api.network/",
  },
  {
    name: "Acala Foundation 2",
    url: "wss://acala-rpc-2.aca-api.network/ws",
  },
  {
    name: "Acala Foundation 3",
    url: "wss://acala-rpc-3.aca-api.network/ws",
  },
];
export const DEFAULT_ACALA_NODE_URL = DEFAULT_ACALA_NODES[0]?.url;

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

export const DEFAULT_KINTSUGI_NODES =
  process.env.NEXT_PUBLIC_DEVELOPMENT === "true"
    ? [
        {
          name: "Kintsugi Test Endpoint",
          url: "wss://api-dev-kintsugi.interlay.io/parachain",
        },
      ]
    : [
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
  acala: DEFAULT_ACALA_NODE_URL,
  khala: DEFAULT_KHALA_NODE_URL,
  basilisk: DEFAULT_BASILISK_NODE_URL,
  bifrost: DEFAULT_BIFROST_NODE_URL,
  kintsugi: DEFAULT_KINTSUGI_NODE_URL,
};

export const nodes = [
  ...(process.env.NEXT_PUBLIC_DEVELOPMENT === "true"
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
    value: "acala",
    name: "Acala",
    icon: "acala.svg",
    identity: "polkadot",
    symbol: "ACA",
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
    // identity: "kabocha",
    // symbol: "",
    // decimals: 0,
    // hasElections: true,
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
    voteSymbol: "vKINT",
    decimals: 12,
    hasElections: false,
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
    name: "DEMOCRACY",
    excludeToChains: ["kabocha"],
    items: [
      {
        value: "referenda",
        name: "Referenda",
        pathname: "/democracy/referendums",
      },
      {
        value: "democracyProposals",
        name: "Proposals",
        pathname: "/democracy/proposals",
      },
      {
        value: "democracyExternals",
        excludeToChains: ["kintsugi"],
        name: "External",
        pathname: "/democracy/externals",
      },
    ],
  },
  {
    name: "TREASURY",
    excludeToChains: ["kabocha"],
    items: [
      {
        value: "proposals",
        name: "Proposals",
        pathname: "/treasury/proposals",
      },
      {
        value: "bounties",
        name: "Bounties",
        pathname: "/treasury/bounties",
        excludeToChains: ["basilisk", "kintsugi"],
      },
      {
        value: "tips",
        name: "Tips",
        pathname: "/treasury/tips",
        excludeToChains: ["kintsugi"],
      },
    ],
  },
  {
    name: "COUNCIL",
    excludeToChains: ["kabocha", "kintsugi"],
    items: [
      {
        value: "motions",
        name: "Motions",
        pathname: "/council/motions",
      },
      {
        value: "councilMembers",
        name: "Members",
        pathname: "/council/members",
      },
    ],
  },
  {
    name: "TECH.COMM.",
    excludeToChains: ["kabocha"],
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
  {
    name: "FINANCIAL COUNCIL",
    items: [
      {
        value: "financialMotions",
        name: "Motions",
        pathname: "/financial-council/motions",
      },
      {
        value: "financialCouncilMembers",
        name: "Members",
        pathname: "/financial-council/members",
      },
    ],
    excludeToChains: [
      "khala",
      "kusamu",
      "basilisk",
      "kabocha",
      "bifrost",
      "kintsugi",
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
  kabocha: 2,
  bifrost: 6,
  kintsugi: 2092,
};

export const Chains = {
  polkadot: "polkadot",
  kusama: "kusama",
  karura: "karura",
  acala: "acala",
  khala: "khala",
  substrate: "substrate",
  basilisk: "basilisk",
  kabocha: "kabocha",
  bifrost: "bifrost",
  kintsugi: "kintsugi",
};

export const TreasuryAccount =
  "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";

export const DEFAULT_SEO_INFO = {
  title: `SubSquare`,
  desc: `A platform that scans and normalizes the blockchain governance data. It enables community members to propose, vote proposals and discuss the corresponding topics.`,
};
