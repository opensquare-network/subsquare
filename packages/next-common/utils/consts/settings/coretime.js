import polkadot from "./polkadot";

const endpoints = [
  {
    name: "Parity",
    url: "wss://polkadot-coretime-rpc.polkadot.io",
  },
  {
    name: "IBP2",
    url: "wss://coretime-polkadot.dotters.network",
  },
];

const coretime = {
  ...polkadot,
  value: "coretime",
  name: "Coretime",
  description:
    "A revolutionary approach to accessing the right amount of blockspace for every stage of growth.",
  endpoints,
};

export default coretime;
