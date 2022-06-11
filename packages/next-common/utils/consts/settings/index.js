import Chains from "../chains";
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

export default function getChainSettings(chain) {
  if (Chains.polkadot === chain) {
    return polkadot;
  } else if (Chains.kusama === chain) {
    return kusama;
  } else if (Chains.acala === chain) {
    return acala;
  } else if (Chains.basilisk === chain) {
    return basilisk;
  } else if (Chains.bifrost === chain) {
    return bifrost;
  } else if (Chains.calamari === chain) {
    return calamari;
  } else if (Chains.crab === chain) {
    return crab;
  } else if (Chains.interlay === chain) {
    return interlay;
  } else if (Chains.karura === chain) {
    return karura;
  } else if (Chains.khala === chain) {
    return khala;
  } else if (Chains.kintsugi === chain) {
    return kintsugi;
  } else if (Chains.polkadex === chain) {
    return polkadex;
  } else if (Chains.turing === chain) {
    return turing;
  }

  throw `can not get chain settings of ${chain}`;
}
