const DEFAULT_KINTSUGI_NODES =
  process.env.NEXT_PUBLIC_DEVELOPMENT === "true"
    ? [
        {
          name: "Kintsugi Test Endpoint",
          url: "wss://api-dev-kintsugi.interlay.io/parachain",
        },
      ]
    : [
        {
          name: "OnFinality",
          url: "wss://kintsugi.api.onfinality.io/public-ws",
        },
        {
          name: "Kintsugi Labs",
          url: "wss://api-kusama.interlay.io/parachain",
        },
      ];

const kintsugi = {
  value: "kintsugi",
  name: "Kintsugi",
  icon: "kintsugi.png",
  identity: "kusama",
  symbol: "KINT",
  voteSymbol: "vKINT",
  decimals: 12,
  hasElections: false,
  ss58Format: 2092,
  endpoints: DEFAULT_KINTSUGI_NODES,
};

export default kintsugi;
