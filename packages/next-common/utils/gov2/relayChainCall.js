import { isSupportedCallVersion } from "./relayToParachainCall";

export function isXcmCall(call) {
  return call?.section === "polkadotXcm" && call?.method === "send";
}
export function isFromParaToRelayChain(xcmLocation) {
  if (!isSupportedCallVersion(xcmLocation)) {
    return null;
  }
  if (xcmLocation.isV4) {
    const V4Location = xcmLocation.asV4;
    return V4Location?.parents.toNumber() === 1 && V4Location?.interior.isHere;
  } else if (xcmLocation.isV3) {
    const V3Location = xcmLocation.asV3;
    return V3Location?.parents.toNumber() === 1 && V3Location?.interior.isHere;
  }
  return null;
}

// `messageArg` are a group of XCM instructions in v3 and v4
export function extractTransactCallBytesArr(messageArg) {
  let instructions;

  if (messageArg?.isV3) {
    instructions = messageArg?.asV3;
  } else if (messageArg?.isV4) {
    instructions = messageArg?.asV4;
  }

  if (!Array.isArray(instructions)) {
    return [];
  }

  return instructions.reduce((acc, instruction) => {
    if (!instruction.isTransact) {
      return acc;
    }
    const transact = instruction.asTransact;
    return [...acc, transact.call.encoded];
  }, []);
}
