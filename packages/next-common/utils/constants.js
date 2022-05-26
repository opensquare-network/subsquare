import menus from "./consts/menus";
import {
  DEFAULT_CALAMARI_NODES,
  DEFAULT_CRUST_NODES,
  DEFAULT_INTERLAY_NODES,
  DEFAULT_KARURA_NODES,
  DEFAULT_TURING_NODES,
  DEFAULT_TURING_NODE_URL,
} from "./consts/endpoints";
import { calamari, crust, interlay, turing } from "./consts/networks";
import Chains from "./consts/chains";

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
    name: "Dwellir",
    url: "wss://kusama-rpc.dwellir.com",
  },
  {
    name: "RadiumBlock",
    url: "wss://kusama.public.curie.radiumblock.co/ws",
  },
];
export const DEFAULT_KUSAMA_NODE_URL = DEFAULT_KUSAMA_NODES[0]?.url;

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
  {
    name: "Dwellir",
    url: "wss://khala-rpc.dwellir.com",
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

export const DEFAULT_POLKADEX_NODES = [
  {
    name: "Polkadex",
    url: "wss://mainnet.polkadex.trade/",
  },
  {
    name: "Polkadex-JP",
    url: "wss://mainnet-jp-1.polkadex.trade",
  },
];

export const DEFAULT_POLKADEX_NODE_URL = DEFAULT_POLKADEX_NODES[0].url;

export const nodes = [
  {
    value: "kusama",
    name: "Kusama",
    icon: "kusama.svg",
    identity: "kusama",
    symbol: "KSM",
    decimals: 12,
    hasElections: true,
  },
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
  // polkadex,
  interlay,
  crust,
  calamari,
  turing,
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
};

export const defaultNodes = {
  kusama: DEFAULT_KUSAMA_NODES,
  karura: DEFAULT_KARURA_NODES,
  acala: DEFAULT_ACALA_NODES,
  khala: DEFAULT_KHALA_NODES,
  basilisk: DEFAULT_BASILISK_NODES,
  bifrost: DEFAULT_BIFROST_NODES,
  kintsugi: DEFAULT_KINTSUGI_NODES,
  polkadex: DEFAULT_POLKADEX_NODES,
  [Chains.interlay]: DEFAULT_INTERLAY_NODES,
  [Chains.crust]: DEFAULT_CRUST_NODES,
  [Chains.calamari]: DEFAULT_CALAMARI_NODES,
  [Chains.turing]: DEFAULT_TURING_NODES,
};

export const ChainBlockTime = {
  polkadot: 6000,
  kusama: 6000,
  [Chains.crust]: 6000,
};

export const defaultBlockTime = 12000;

export const DEFAULT_SEO_INFO = {
  title: `SubSquare`,
  desc: `A platform that scans and normalizes the blockchain governance data. It enables community members to propose, vote proposals and discuss the corresponding topics.`,
};
