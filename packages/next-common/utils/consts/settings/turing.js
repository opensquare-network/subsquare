import Chains from "../chains";
import capitalize from "../../capitalize";

export const DEFAULT_TURING_NODES = [
  {
    name: "OnFinality",
    url: "wss://turing.api.onfinality.io/public-ws",
  },
  {
    name: "OAK",
    url: "wss://rpc.turing.oak.tech",
  },
  {
    name: "Dwellir",
    url: "wss://turing-rpc.dwellir.com",
  },
];

const turing = {
  value: Chains.turing,
  name: capitalize(Chains.turing),
  icon: "turing.svg",
  identity: Chains.kusama,
  symbol: "TUR",
  decimals: 10,
  hasElections: false,
  endpoints: DEFAULT_TURING_NODES,
};

export default turing;
