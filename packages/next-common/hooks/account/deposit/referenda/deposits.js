function getData(storage) {
  if (storage.isApproved) {
    return storage.asApproved;
  } else if (storage.isRejected) {
    return storage.asRejected;
  } else if (storage.isCancelled) {
    return storage.asCancelled;
  } else if (storage.isTimedOut) {
    return storage.asTimedOut;
  }

  throw new Error(`Unknown referendum info, ${storage.toJSON()}`);
}

function extractDeposit(depositObject) {
  if (depositObject.isNone) {
    return null;
  } else {
    const unwrapped = depositObject.unwrap();
    return {
      who: unwrapped.who.toString(),
      amount: unwrapped.amount.toString(),
    };
  }
}

export default async function queryAddressDeposits(
  api,
  address,
  pallet = "referenda",
) {
  const entries = await api.query[pallet].referendumInfoFor.entries();
  return entries.reduce((result, [storageKey, optionalStorage]) => {
    if (!optionalStorage.isSome) {
      return result;
    }

    const referendumIndex = storageKey.args[0].toNumber();
    const storage = optionalStorage.unwrap();
    if (
      storage.isRejected ||
      storage.isApproved ||
      storage.isCancelled ||
      storage.isTimedOut
    ) {
      const data = getData(storage);
      const submissionDeposit = extractDeposit(data[1]);
      const decisionDeposit = extractDeposit(data[2]);
      console.log(
        "referendumIndex",
        referendumIndex,
        "data",
        data,
        "submissionDeposit",
        submissionDeposit,
        "decisionDeposit",
        decisionDeposit,
      );
    }
  }, []);
}
