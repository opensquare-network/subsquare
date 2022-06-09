import Chains from "./chains";
import capitalize from "../capitalize";

const interlay = {
  value: "interlay",
  name: "Interlay",
  icon: "interlay.svg",
  identity: "kusama",
  symbol: "INTR",
  voteSymbol: "vINTR",
  decimals: 10,
  hasElections: false,
};

export const kintsugi = {
  value: "kintsugi",
  name: "Kintsugi",
  icon: "kintsugi.png",
  identity: "kusama",
  symbol: "KINT",
  voteSymbol: "vKINT",
  decimals: 12,
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

export const polkadot = {
  value: "polkadot",
  name: "Polkadot",
  icon: "polkadot.svg",
  identity: "polkadot",
  symbol: "DOT",
  decimals: 10,
  hasElections: true,
};

export const kusama = {
  value: "kusama",
  name: "Kusama",
  icon: "kusama.svg",
  identity: "kusama",
  symbol: "KSM",
  decimals: 12,
  hasElections: true,
};

export const karura = {
  value: "karura",
  name: "Karura",
  icon: "karura.svg",
  identity: "kusama",
  symbol: "KAR",
  decimals: 12,
  hasElections: false,
};

export const acala = {
  value: "acala",
  name: "Acala",
  icon: "acala.svg",
  identity: "polkadot",
  symbol: "ACA",
  decimals: 12,
  hasElections: false,
};

export const khala = {
  value: "khala",
  name: "Khala",
  icon: "khala.svg",
  identity: "khala",
  symbol: "PHA",
  decimals: 12,
  hasElections: true,
};

export const bifrost = {
  value: "bifrost",
  name: "Bifrost",
  icon: "bifrost.svg",
  hideHeight: false,
  identity: "bifrost",
  symbol: "bnc",
  decimals: 12,
  hasElections: true,
};

export const basilisk = {
  value: "basilisk",
  name: "Basilisk",
  icon: "basilisk.svg",
  identity: "basilisk",
  symbol: "BSX",
  decimals: 12,
  hasElections: true,
};

export { interlay, polkadex, crust };
