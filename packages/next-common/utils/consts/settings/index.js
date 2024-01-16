import polkadot from "./polkadot";
import kusama from "./kusama";
import acala from "./acala";
import basilisk from "./basilisk";
import bifrost from "./bifrost";
import calamari from "./calamari";
import crab from "./crab";
import interlay from "./interlay";
import karura from "./karura";
import khala from "./khala";
import phala from "./phala";
import kintsugi from "./kintsugi";
import polkadex from "./polkadex";
import turing from "./turing";
import crust from "./crust";
import centrifuge from "./centrifuge";
import litmus from "./litmus";
import zeitgeist from "./zeitgeist";
import altair from "./altair";
import hydradx from "./hydradx";
import hydradxTestnet from "./hydradxTestnet";
import development from "./development";
import rococo from "./rococo";
import litentry from "./litentry";
import westendCollectives from "./westendCollectives";
import westend from "./westend";
import collectives from "./collectives";
import darwinia2 from "./darwinia2";
import moonriver from "./moonriver";
import moonbeam from "./moonbeam";
import bifrostPolkadot from "./bifrostPolkadot";
import vara from "./vara";

const settingsMap = {
  polkadot,
  kusama,
  acala,
  altair,
  basilisk,
  bifrost,
  calamari,
  centrifuge,
  collectives,
  crab,
  crust,
  darwinia2,
  hydradx,
  [hydradxTestnet.value]: hydradxTestnet,
  interlay,
  karura,
  khala,
  kintsugi,
  litentry,
  litmus,
  moonbeam,
  moonriver,
  phala,
  polkadex,
  turing,
  zeitgeist,
  rococo,
  westend,
  [westendCollectives.value]: westendCollectives,
  [bifrostPolkadot.value]: bifrostPolkadot,
  vara,
  ...(process.env.NEXT_PUBLIC_DEVELOPMENT === "true" ? { development } : {}),
};

/**
 * @returns {typeof kusama & typeof polkadot & typeof kintsugi & typeof moonriver & typeof centrifuge & typeof collectives}
 */
export default function getChainSettings(chain) {
  const settings = settingsMap[chain];
  if (!settings) {
    throw `can not get chain settings of ${chain}`;
  }

  return settings;
}
