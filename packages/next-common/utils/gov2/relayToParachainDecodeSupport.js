import Chains from "../consts/chains";
import { isKusamaChain, isPolkadotChain } from "../chain";
import { CHAIN } from "../constants";
import {
  AssetHubParaId,
  CollectivesParaId,
} from "next-common/components/assets/paraChainTeleportPopup/teleportFromRelayChainToParaChain";

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
    }
  } else if (isKusamaChain(CHAIN)) {
    if (ParachainId === AssetHubParaId) {
      return Chains.kusamaAssetHub;
    } else if (ParachainId === PeopleParaId) {
      return Chains.kusamaPeople;
    } else if (ParachainId === CoretimeParaId) {
      return Chains.kusamaCoretime;
    }
  }
  if (ParachainId === CollectivesParaId) {
    return Chains.collectives;
  }

  return null;
}
