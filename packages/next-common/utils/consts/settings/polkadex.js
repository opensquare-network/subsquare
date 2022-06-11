const DEFAULT_POLKADEX_NODES = [
  {
    name: "Polkadex",
    url: "wss://mainnet.polkadex.trade/",
  },
  {
    name: "Polkadex-JP",
    url: "wss://mainnet-jp-1.polkadex.trade",
  },
  {
    name: "OnFinality",
    url: "wss://polkadex.api.onfinality.io/public-ws",
  },
];

const polkadex = {
  value: "polkadex",
  name: "Polkadex",
  icon: "polkadex.svg",
  identity: "polkadex",
  symbol: "PDEX",
  decimals: 12,
  hasElections: true,
  endpoints: DEFAULT_POLKADEX_NODES,
};

export default polkadex;
