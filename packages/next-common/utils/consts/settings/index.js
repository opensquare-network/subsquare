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
import darwinia2 from "./darwinia";
import moonriver from "./moonriver";
import moonbeam from "./moonbeam";
import bifrostPolkadot from "./bifrostPolkadot";
import vara from "./vara";
import polkadotAssetHub from "./polkadotAssetHub";
import westendAssetHub from "./westendAssetHub";
import shibuya from "./shibuya";
import astar from "./astar";
import { isNil } from "lodash-es";
import zkverifyTestnet from "./zkverifyTestnet";

const settingsMap = {
  polkadot,
  kusama,
  acala,
  altair,
  astar,
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
  [polkadotAssetHub.value]: polkadotAssetHub,
  [westendAssetHub.value]: westendAssetHub,
  vara,
  shibuya,
  [zkverifyTestnet.value]: zkverifyTestnet,
  ...(process.env.NEXT_PUBLIC_DEVELOPMENT === "true" ? { development } : {}),
};

/**
 * @returns {typeof kusama & typeof polkadot & typeof kintsugi & typeof moonriver & typeof centrifuge & typeof collectives & typeof hydradx & typeof zkverifyTestnet}
 */
export default function getChainSettings(chain, blockHeight = null) {
  let settings = settingsMap[chain];
  if (!settings) {
    throw `can not get chain settings of ${chain}`;
  }

  if (settings.blockHeightSettings && !isNil(blockHeight)) {
    const heights = Object.keys(settings.blockHeightSettings)
      .map(Number)
      // descending block heights
      .sort((a, b) => b - a);

    const blockHeightSettingsPatch =
      settings.blockHeightSettings[
        heights.find((height) => blockHeight >= height)
      ];

    if (blockHeightSettingsPatch) {
      settings = { ...settings, ...blockHeightSettingsPatch };
    }
  }

  if (process.env.NEXT_PUBLIC_LOCAL_CHOPSTICKS === "true") {
    settings = {
      ...settings,
      endpoints: [
        {
          name: "Chopsticks",
          url: "ws://127.0.0.1:8000",
        },
      ],
    };
  }

  return {
    ...settings,
    modules: settings.modules || {},
  };
}
