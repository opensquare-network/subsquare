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
  if (!xcmLocation?.isV4) {
    // todo: currently we only support xcm v4, but we need to support more versions
    return false;
  }

  const v4Location = xcmLocation.asV4;
  return v4Location.parents.toNumber() === 1 && v4Location.interior.isHere;
}

// `messageArg` are a group of XCM instructions
export function extractTransactCallBytesArr(messageArg) {
  if (!messageArg?.isV4) {
    return [];
  }

  const instructionsV4 = messageArg?.asV4;
  if (!Array.isArray(instructionsV4)) {
    return [];
  }

  return instructionsV4.reduce((acc, instruction) => {
    if (!instruction.isTransact) {
      return acc;
    }
    const transact = instruction.asTransact;
    if (transact.originKind?.toString() !== "Xcm") {
      return acc;
    }
    return [...acc, transact.call.encoded];
  }, []);
}
