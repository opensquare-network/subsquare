import Chains from "../chains";
import capitalize from "../../capitalize";

const DEFAULT_CRUST_NODES = [
  {
    name: "OnFinality",
    url: "wss://crust.api.onfinality.io/public-ws",
  },
  {
    name: "Crust",
    url: "wss://rpc.crust.network",
  },
  {
    name: "Decoo Technologies",
    url: "wss://rpc-crust-mainnet.decoo.io",
  },
  {
    name: "DCloud Foundation",
    url: "wss://api.decloudf.com",
  },
];

const crust = {
  value: Chains.crust,
  name: capitalize(Chains.crust),
  icon: "crust.svg",
  identity: "crust",
  symbol: "CRU",
  decimals: 12,
  hasElections: false,
  ss58Format: 66,
  blockTime: 6000,
  endpoints: DEFAULT_CRUST_NODES,
};

export default crust;
