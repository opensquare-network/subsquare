const DEFAULT_BIFROST_NODES = [
  {
    name: "OnFinality",
    url: "wss://bifrost-parachain.api.onfinality.io/public-ws",
  },
  {
    name: "Liebi 0",
    url: "wss://bifrost-rpc.liebi.com/ws",
  },
  {
    name: "Liebi 1",
    url: "wss://us.bifrost-rpc.liebi.com/ws",
  },
  {
    name: "Liebi 2",
    url: "wss://us.bifrost-rpc.liebi.com/ws",
  },
  {
    name: "Dwellir",
    url: "wss://bifrost-rpc.dwellir.com",
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
  ss58Format: 6,
  snsCoverCid: "bafybeibu7lmjymi5x6gjixdawmc4rjufruc6qwazailfnpzpoaqtuq6khe",
  endpoints: DEFAULT_BIFROST_NODES,
  loginButtonPrimary: true,
  headerBackgroundColor: "#000000",
};

export default bifrost;
