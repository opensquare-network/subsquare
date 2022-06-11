const DEFAULT_BIFROST_NODES = [
  {
    name: "OnFinality",
    url: "wss://bifrost-parachain.api.onfinality.io/public-ws",
  },
  {
    name: "Liebi",
    url: "wss://bifrost-rpc.liebi.com/ws",
  },
];

const bifrost = {
  value: "bifrost",
  name: "Bifrost",
  icon: "bifrost.svg",
  hideHeight: false,
  identity: "bifrost",
  symbol: "bnc",
  decimals: 12,
  hasElections: true,
  endpoints: DEFAULT_BIFROST_NODES,
};

export default bifrost;
