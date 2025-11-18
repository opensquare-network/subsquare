const westendRelayChainNodes = [
  {
    name: "Parity",
    url: "wss://westend-rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://westend.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://westend-rpc.n.dwellir.com",
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
  { name: "Dwellir", url: "wss://asset-hub-westend-rpc.n.dwellir.com" },
  { name: "Dwellir Tunisia", url: "wss://westmint-rpc-tn.dwellir.com" },
];

export { westendRelayChainNodes, westendAssetHubNodes };
