import BigNumber from "bignumber.js";
import { isSameAddress } from "next-common/utils";

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
  return entries.reduce(
    (result, [storageKey, optionalStorage]) => {
      if (!optionalStorage.isSome) {
        return result;
      }

      const { submissionDeposits, decisionDeposits } = result;
      const referendumIndex = storageKey.args[0].toNumber();
      const storage = optionalStorage.unwrap();
      let submissionDeposit;
      let decisionDeposit;
      if (
        storage.isRejected ||
        storage.isApproved ||
        storage.isCancelled ||
        storage.isTimedOut
      ) {
        const data = getData(storage);
        submissionDeposit = extractDeposit(data[1]);
        decisionDeposit = extractDeposit(data[2]);
      } else if (storage.isOngoing) {
        const ongoing = storage.asOngoing;
        submissionDeposit = {
          who: ongoing.submissionDeposit.who.toString(),
          amount: ongoing.submissionDeposit.amount.toString(),
        };
        decisionDeposit = extractDeposit(ongoing.decisionDeposit);
      }

      if (
        isSameAddress(submissionDeposit?.who, address) &&
        new BigNumber(submissionDeposit?.amount).gt(0)
      ) {
        submissionDeposits.push({
          referendumIndex,
          deposit: submissionDeposit?.amount,
        });
      }
      if (
        isSameAddress(decisionDeposit?.who, address) &&
        new BigNumber(decisionDeposit?.amount).gt(0)
      ) {
        decisionDeposits.push({
          referendumIndex,
          deposit: decisionDeposit?.amount,
        });
      }

      return {
        submissionDeposits,
        decisionDeposits,
      };
    },
    { submissionDeposits: [], decisionDeposits: [] },
  );
}
