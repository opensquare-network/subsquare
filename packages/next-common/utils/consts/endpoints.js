export const DEFAULT_INTERLAY_NODES = [
  {
    name: "Kintsugi Labs",
    url: "wss://api.interlay.io/parachain",
  },
];

export const DEFAULT_INTERLAY_NODE_URL = DEFAULT_INTERLAY_NODES[0]?.url;

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

export const DEFAULT_CRUST_NODES = [
  {
    name: "OnFinality",
    url: "wss://crust.api.onfinality.io/public-ws",
  },
  {
    name: "Crust",
    url: "wss://rpc.crust.network",
  },
  {
    name: "Decoo Technologies",
    url: "wss://rpc-crust-mainnet.decoo.io",
  },
  {
    name: "DCloud Foundation",
    url: "wss://api.decloudf.com",
  },
];
export const DEFAULT_CRUST_NODE_URL = DEFAULT_CRUST_NODES[0].url;

export const DEFAULT_CALAMARI_NODES = [
  {
    name: "OnFinality",
    url: "wss://calamari.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://calamari-rpc.dwellir.com",
  },
  {
    name: "Manta Network",
    url: "wss://ws.calamari.systems/",
  },
];
export const DEFAULT_CALAMARI_NODE_URL = DEFAULT_CALAMARI_NODES[0].url;

export const DEFAULT_TURING_NODES = [
  {
    name: "OnFinality",
    url: "wss://turing.api.onfinality.io/public-ws",
  },
  {
    name: "OAK",
    url: "wss://rpc.turing.oak.tech",
  },
  {
    name: "Dwellir",
    url: "wss://turing-rpc.dwellir.com",
  },
];

export const DEFAULT_TURING_NODE_URL = DEFAULT_TURING_NODES[0].url;
