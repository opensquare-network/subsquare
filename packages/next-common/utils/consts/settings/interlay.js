const DEFAULT_INTERLAY_NODES = [
  {
    name: "Kintsugi Labs",
    url: "wss://api.interlay.io/parachain",
  },
  {
    name: "OnFinality",
    url: "wss://interlay.api.onfinality.io/public-ws",
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
  snsCoverCid: "bafybeifqabzy3677ms2jihcb4ed4kxcvbjtxskctjboidcoy7pbosqrqyi",
  endpoints: DEFAULT_INTERLAY_NODES,
};

export default interlay;
