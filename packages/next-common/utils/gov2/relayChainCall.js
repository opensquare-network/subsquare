import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";
import { getRelayChain } from "next-common/utils/chain";
import { getOriginApi } from "next-common/services/chain/api";

export function getXcmLocationApi() {
  const chain = getRelayChain(CHAIN);
  if (!chain) {
    return null;
  }
  const { endpoints } = getChainSettings(chain);
  const endpoint = endpoints[0]?.url;

  return getOriginApi(chain, endpoint);
}

export function isXcmCall(call) {
  return call?.section === "polkadotXcm" && call?.method === "send";
}

export function isFromParaToRelayChain(xcmLocation) {
  if (!xcmLocation?.value?.v4) return false;
  const { parents, interior } = xcmLocation.value.v4 || {};
  return parents === 1 && interior?.here === null;
}

function isCrossChainMessage(instruction) {
  return instruction?.transact && instruction.transact.originKind === "Xcm";
}

export function getXcmEncodeds(messageArg) {
  const instructions = messageArg?.value?.v4 || [];
  return instructions.filter(isCrossChainMessage).map((instruction) => {
    return instruction.transact?.call?.encoded;
  });
}
