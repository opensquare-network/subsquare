const DEFAULT_INTERLAY_NODES = [
  {
    name: "Kintsugi Labs",
    url: "wss://api.interlay.io/parachain",
  },
];

const interlay = {
  value: "interlay",
  name: "Interlay",
  icon: "interlay.svg",
  identity: "kusama",
  symbol: "INTR",
  voteSymbol: "vINTR",
  decimals: 10,
  hasElections: false,
  ss58Format: 2032,
  endpoints: DEFAULT_INTERLAY_NODES,
};

export default interlay;
