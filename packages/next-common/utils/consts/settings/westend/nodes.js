const westendRelayChainNodes = [
  {
    name: "Parity",
    url: "wss://westend-rpc.polkadot.io",
  },
  {
    name: "IBP1",
    url: "wss://rpc.ibp.network/westend",
  },
  {
    name: "IBP2",
    url: "wss://westend.dotters.network",
  },
  {
    name: "OnFinality",
    url: "wss://westend.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://westend-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://westend-rpc-tn.dwellir.com",
  },
  {
    name: "RadiumBlock",
    url: "wss://westend.public.curie.radiumblock.co/ws",
  },
  {
    name: "light client",
    url: "light://substrate-connect/westend",
  },
];

const westendAssetHubNodes = [
  { name: "Parity", url: "wss://westend-asset-hub-rpc.polkadot.io" },
  { name: "IBP1", url: "wss://sys.ibp.network/asset-hub-westend" },
  { name: "IBP2", url: "wss://asset-hub-westend.dotters.network" },
  { name: "Dwellir", url: "wss://asset-hub-westend-rpc.dwellir.com" },
  { name: "Dwellir Tunisia", url: "wss://westmint-rpc-tn.dwellir.com" },
  {
    name: "Permanence DAO EU",
    url: "wss://asset-hub-westend.rpc.permanence.io",
  },
];

export { westendRelayChainNodes, westendAssetHubNodes };
