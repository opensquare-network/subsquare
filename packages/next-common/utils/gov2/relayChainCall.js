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

const isXcmOrCrossOriginKind = (originKind) => {
  return (
    originKind?.toString() === "Xcm" || originKind?.toString() === "Superuser"
  );
};

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
    if (!isXcmOrCrossOriginKind(transact.originKind)) {
      return acc;
    }
    return [...acc, transact.call.encoded];
  }, []);
}
