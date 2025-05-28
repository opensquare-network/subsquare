import { isSupportedCallVersion } from "./relayToParachainCall";

export function isXcmCall(call) {
  return call?.section === "polkadotXcm" && call?.method === "send";
}
export function isFromParaToRelayChain(xcmLocation) {
  if (!isSupportedCallVersion(xcmLocation)) {
    return null;
  }
  if (xcmLocation.isV4) {
    return (
      xcmLocation.asV4.parents.toNumber() === 1 &&
      xcmLocation.asV4.interior.isHere
    );
  }
  if (xcmLocation.isV3) {
    return (
      xcmLocation.asV3.parents.toNumber() === 1 &&
      xcmLocation.asV3.interior.isHere
    );
  }
  return null;
}

// `messageArg` are a group of XCM instructions in v3 and v4
export function extractTransactCallBytesArr(messageArg) {
  let instructions;

  if (messageArg?.isV3) {
    instructions = messageArg?.asV3;
  }

  if (messageArg?.isV4) {
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
