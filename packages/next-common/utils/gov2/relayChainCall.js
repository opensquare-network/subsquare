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
