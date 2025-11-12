import Chains from "../consts/chains";
import { isKusamaChain, isPolkadotChain } from "../chain";
import { CHAIN } from "../constants";
import {
  AssetHubParaId,
  CollectivesParaId,
} from "next-common/components/assethubMigrationAssets/paraChainTeleportPopup/teleportFromRelayChainToParaChain";
import Chainspolyfill from "../consts/settingsPolyfill/chainsPolyfill";

export const BridgeParaId = 1002;
export const PeopleParaId = 1004;
export const CoretimeParaId = 1005;

export function getParachain(ParachainId) {
  if (isPolkadotChain(CHAIN)) {
    if (ParachainId === AssetHubParaId) {
      return Chains.polkadotAssetHub;
    } else if (ParachainId === PeopleParaId) {
      return Chains.polkadotPeople;
    } else if (ParachainId === CoretimeParaId) {
      return Chains.polkadotCoretime;
    } else if (ParachainId === BridgeParaId) {
      return Chainspolyfill.polkadotBridge;
    }
  } else if (isKusamaChain(CHAIN)) {
    if (ParachainId === AssetHubParaId) {
      return Chains.kusamaAssetHub;
    } else if (ParachainId === PeopleParaId) {
      return Chains.kusamaPeople;
    } else if (ParachainId === CoretimeParaId) {
      return Chains.kusamaCoretime;
    } else if (ParachainId === BridgeParaId) {
      return Chainspolyfill.kusamaBridge;
    }
  }
  if (ParachainId === CollectivesParaId) {
    return Chains.collectives;
  }

  return null;
}
