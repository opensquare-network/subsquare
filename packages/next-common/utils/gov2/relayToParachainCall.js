import {
  CollectivesParaId,
  AssetHubParaId,
} from "next-common/components/assets/paraChainTeleportPopup/teleportFromRelayChainToParaChain";
import { extractTransactCallBytesArr } from "./relayChainCall";
import {
  BridgeParaId,
  CoretimeParaId,
  PeopleParaId,
} from "./relayToParachainDecodeSupport";

export function isXcmPallet(call) {
  return call.section === "xcmPallet" && call.method === "send";
}

export function isForceBatch(call) {
  return call.section === "utility" && call.method === "forceBatch";
}

export function isBatch(call) {
  return call.section === "utility" && call.method === "batch";
}

export function isBatchAll(call) {
  return call.section === "utility" && call.method === "batchAll";
}

export function isCall(call) {
  return call.call && call.Type?.call === "call";
}

export function isCollectivesCall(xcmLocation) {
  return xcmLocation?.toNumber() === CollectivesParaId;
}

export function isPolkadotAssetHubCall(xcmLocation) {
  return xcmLocation?.toNumber() === AssetHubParaId;
}

export function isBridgeCall(xcmLocation) {
  return xcmLocation?.toNumber() === BridgeParaId;
}

export function isPeopleCall(xcmLocation) {
  return xcmLocation?.toNumber() === PeopleParaId;
}

export function isCoretimeCall(xcmLocation) {
  return xcmLocation?.toNumber() === CoretimeParaId;
}

export function isSupportedParachainCall(xcmLocation) {
  return (
    isCollectivesCall(xcmLocation) ||
    isPolkadotAssetHubCall(xcmLocation) ||
    isBridgeCall(xcmLocation) ||
    isPeopleCall(xcmLocation) ||
    isCoretimeCall(xcmLocation)
  );
}

export function isCrossChainCall(xcmLocation) {
  if (!xcmLocation?.isV4) {
    // todo: currently we only support xcm v4, but we need to support more versions
    return false;
  }

  const v4Location = xcmLocation.asV4;
  const isX1 = v4Location.parents.toNumber() === 0 && v4Location.interior.isX1;
  if (!isX1) {
    // todo: currently we only support x1
    return false;
  }
  return !!v4Location.interior.asX1.find((item) => item.isParachain);
}

export function parseParachain(xcmLocation) {
  if (!xcmLocation?.isV4) {
    return null;
  }
  const v4Location = xcmLocation.asV4;
  if (!v4Location.interior.isX1) {
    return null;
  }
  const parachain = v4Location.interior.asX1.find((item) => item.isParachain);
  return parachain?.asParachain;
}

export function convertCrossChainCalls(xcmPallet) {
  const xcmLocation = xcmPallet?.args?.[0];
  const xcmMessage = xcmPallet.args[1];
  if (!xcmLocation || !xcmMessage) {
    return null;
  }
  const parachainId = parseParachain(xcmLocation);
  if (!parachainId) {
    return null;
  }
  return {
    parachainId,
    bytesArr: extractTransactCallBytesArr(xcmMessage),
  };
}

export function findAllSupportedParachainCalls(call) {
  const xcmPallets = findAllXcmPallets(call);
  const calls = xcmPallets
    .map((item) => convertCrossChainCalls(item))
    .filter(Boolean);
  return calls.filter((item) => isSupportedParachainCall(item.parachainId));
}

function findAllXcmPallets(call) {
  const results = [];

  if (isXcmPallet(call)) {
    results.push(call);
    return results;
  }

  if (isCall(call)) {
    call.call.forEach((item) => {
      results.push(...findAllXcmPallets(item));
    });
    return results;
  }

  if (isForceBatch(call) || isBatch(call) || isBatchAll(call)) {
    const batchCalls = call.args?.[0] || [];
    batchCalls.forEach((item) => {
      results.push(...findAllXcmPallets(item));
    });
    return results;
  }

  const args = call.args;
  if (args) {
    args.forEach((arg) => {
      results.push(...findAllXcmPallets(arg));
    });
  }

  return results;
}
