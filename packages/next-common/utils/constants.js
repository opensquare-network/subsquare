import polkadot from "./consts/settings/polkadot";
import kusama from "./consts/settings/kusama";
import crab from "./consts/settings/crab";
import karura from "./consts/settings/karura";
import bifrost from "./consts/settings/bifrost";
import acala from "./consts/settings/acala";
import interlay from "./consts/settings/interlay";
import kintsugi from "./consts/settings/kintsugi";
import khala from "./consts/settings/khala";
import phala from "./consts/settings/phala";
import turing from "./consts/settings/turing";
// import kabocha from "./consts/settings/kabocha";
import crust from "./consts/settings/crust";
import litmus from "./consts/settings/litmus";
import React from "react";

export const nodes = [
  polkadot,
  kusama,
  karura,
  acala,
  khala,
  phala,
  // kabocha,
  bifrost,
  // basilisk,
  kintsugi,
  interlay,
  turing,
  crab,
  // centrifuge,
  crust,
  litmus,
];

export const EmptyList = {
  total: 0,
  page: 1,
  pageSize: 10,
  items: [],
};

export const defaultBlockTime = 12000;

export const DEFAULT_SEO_INFO = {
  title: `SubSquare`,
  desc: `A platform that scans and normalizes the blockchain governance data. It enables community members to propose, vote proposals and discuss the corresponding topics.`,
};

export const BalanceDecimals = {
  DOT: 2,
  KSM: 2,
};
