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

export const calamari = {
  value: Chains.calamari,
  name: capitalize(Chains.calamari),
  icon: "calamari.svg",
  identity: Chains.kusama,
  symbol: "KMA",
  decimals: 12,
  hasElections: false,
};

export const turing = {
  value: Chains.turing,
  name: capitalize(Chains.turing),
  icon: "turing.svg",
  identity: Chains.kusama,
  symbol: "TUR",
  decimals: 10,
  hasElections: false,
};

export const crab = {
  value: Chains.crab,
  name: capitalize(Chains.crab),
  icon: "crab.svg",
  identity: Chains.crab,
  symbol: "CRAB",
  decimals: 9,
  hasElections: true,
};

export { interlay, polkadex, crust };
