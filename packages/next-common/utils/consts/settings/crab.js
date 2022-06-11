import Chains from "../chains";
import capitalize from "../../capitalize";

const DEFAULT_CRAB_NODES = [
  {
    name: "Darwinia",
    url: "wss://crab-rpc.darwinia.network",
  },
  {
    name: "Dwellir",
    url: "wss://darwiniacrab-rpc.dwellir.com",
  },
  {
    name: "OnFinality",
    url: "wss://darwinia-crab.api.onfinality.io/public-ws",
  },
];

const crab = {
  value: Chains.crab,
  name: capitalize(Chains.crab),
  icon: "crab.svg",
  identity: Chains.crab,
  symbol: "CRAB",
  decimals: 9,
  hasElections: true,
  ss58Format: 42,
  blockTime: 6000,
  endpoints: DEFAULT_CRAB_NODES,
};

export default crab;
