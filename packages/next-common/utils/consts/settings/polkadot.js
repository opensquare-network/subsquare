import capitalize from "../../capitalize";

const name = "polkadot";

export const defaultPolkadotNodes = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
];

const polkadot = {
  value: name,
  name: capitalize(name),
  icon: "polkadot.svg",
  identity: "name",
  symbol: "DOT",
  decimals: 10,
  hasElections: true,
  endpoints: defaultPolkadotNodes,
};

export default polkadot;
