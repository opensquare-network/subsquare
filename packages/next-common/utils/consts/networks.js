import Chains from "./chains";
import capitalize from "../capitalize";

const interlay = {
  value: "interlay",
  name: "Interlay",
  icon: "interlay.svg",
  identity: "kusama",
  symbol: "INTR",
  decimals: 10,
  hasElections: false,
};

const polkadex = {
  value: "polkadex",
  name: "Polkadex",
  icon: "polkadex.svg",
  identity: "polkadex",
  symbol: "PDEX",
  decimals: 12,
  hasElections: true,
};

const crust = {
  value: Chains.crust,
  name: capitalize(Chains.crust),
  icon: "crust.svg",
  identity: "crust",
  symbol: "CRU",
  decimals: 12,
  hasElections: false,
};

export { interlay, polkadex, crust };
