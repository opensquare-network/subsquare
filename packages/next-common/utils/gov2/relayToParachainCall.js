import {
  CollectivesParaId,
  AssetHubParaId,
} from "next-common/components/paraChainTeleportPopup/teleportFromRelayChainToParaChain";
import { extractTransactCallBytesArr } from "./relayChainCall";
import {
  BridgeParaId,
  CoretimeParaId,
  PeopleParaId,
} from "./relayToParachainDecodeSupport";

export function isXcmPallet(call) {
  return call.section === "xcmPallet" && call.method === "send";
}

export function isPolkadotXcmPallet(call) {
  return call.section === "polkadotXcm" && call.method === "send";
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

export function isCollectivesCall(parachainId) {
  return parachainId?.toNumber() === CollectivesParaId;
}

export function isPolkadotAssetHubCall(parachainId) {
  return parachainId?.toNumber() === AssetHubParaId;
}

export function isPeopleCall(parachainId) {
  return parachainId?.toNumber() === PeopleParaId;
}

export function isCoretimeCall(parachainId) {
  return parachainId?.toNumber() === CoretimeParaId;
}

export function isBridgeCall(parachainId) {
  return parachainId?.toNumber() === BridgeParaId;
}

export function isSupportedParachainCall(parachainId) {
  return (
    isCollectivesCall(parachainId) ||
    isPolkadotAssetHubCall(parachainId) ||
    isPeopleCall(parachainId) ||
    isCoretimeCall(parachainId) ||
    isBridgeCall(parachainId)
  );
}

export function isSupportedCallVersion(xcmLocation) {
  // todo: currently we only support xcm v5, v4 and v3, but we need to support more versions
  return xcmLocation?.isV5 || xcmLocation?.isV4 || xcmLocation?.isV3;
}

function getLocation(xcmLocation) {
  if (xcmLocation?.isV5) {
    return xcmLocation.asV5;
  } else if (xcmLocation?.isV4) {
    return xcmLocation.asV4;
  } else if (xcmLocation?.isV3) {
    return xcmLocation.asV3;
  }
  return null;
}

export function parseParachain(xcmLocation) {
  if (!isSupportedCallVersion(xcmLocation)) {
    return null;
  }
  const location = getLocation(xcmLocation);
  if (!location?.interior?.isX1) {
    return null;
  }
  if (xcmLocation.isV5 || xcmLocation.isV4) {
    return location.interior.asX1.find((item) => item.isParachain)?.asParachain;
  } else if (xcmLocation.isV3) {
    return location.interior.asX1.asParachain;
  }
  return null;
}

export function convertParachainCalls(xcmPallet) {
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
    .map((item) => convertParachainCalls(item))
    .filter(Boolean);
  return calls.filter((item) => isSupportedParachainCall(item.parachainId));
}

function findAllXcmPallets(call) {
  const results = [];

  if (isXcmPallet(call) || isPolkadotXcmPallet(call)) {
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
