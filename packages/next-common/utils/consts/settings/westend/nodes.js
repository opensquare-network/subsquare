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
];

const westendAssetHubNodes = [
  { name: "Parity", url: "wss://westend-asset-hub-rpc.polkadot.io" },
  { name: "Dwellir", url: "wss://asset-hub-westend-rpc.n.dwellir.com" },
];

export { westendRelayChainNodes, westendAssetHubNodes };
