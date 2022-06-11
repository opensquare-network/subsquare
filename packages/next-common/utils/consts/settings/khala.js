const DEFAULT_KHALA_NODES = [
  {
    name: "OnFinality",
    url: "wss://khala.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://khala-rpc.dwellir.com",
  },
  {
    name: "Pinknode",
    url: "wss://public-rpc.pinknode.io/khala",
  },
];

const khala = {
  value: "khala",
  name: "Khala",
  icon: "khala.svg",
  identity: "khala",
  symbol: "PHA",
  decimals: 12,
  hasElections: true,
  ss58Format: 30,
  endpoints: DEFAULT_KHALA_NODES,
};

export default khala;
