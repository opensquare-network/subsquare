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
import kintsugi from "./kintsugi";
import polkadex from "./polkadex";
import turing from "./turing";
import crust from "./crust";

const settingsMap = {
  polkadot,
  kusama,
  acala,
  basilisk,
  bifrost,
  calamari,
  crust,
  crab,
  interlay,
  karura,
  khala,
  kintsugi,
  polkadex,
  turing,
};

export default function getChainSettings(chain) {
  const settings = settingsMap[chain];
  if (!settings) {
    throw `can not get chain settings of ${chain}`;
  }

  return settings;
}
