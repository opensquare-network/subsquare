import { isSameAddress } from "next-common/utils";

function extractInfoFromUnrequested(unrequested, hash) {
  const depositTuple = unrequested.deposit;
  const depositor = depositTuple[0].toString();
  const deposit = depositTuple[1].toString();
  const len = unrequested.len.toNumber();

  return {
    hash,
    len,
    depositor,
    deposit,
    method: "statusFor",
  };
}

function extractInfoFromRequested(requested, hash) {
  if (!requested.deposit.isSome) {
    return null; // no deposit
  }

  const depositTuple = requested.deposit.unwrap();
  const depositor = depositTuple[0].toString();
  const deposit = depositTuple[1].toString();
  const len = requested.len.isSome ? requested.len.unwrap().toNumber() : null; // should be an exception here. We should have the len info if there is a deposit.

  return {
    hash,
    len,
    depositor,
    deposit,
    method: "statusFor",
  };
}

export async function queryAddressPreimageDepositsWithStatusFor(api, address) {
  const entries = await api?.query.preimage?.statusFor?.entries();
  return (entries || [])
    .reduce((result, entry) => {
      const [storageKey, rawStatus] = entry;
      if (!rawStatus.isSome) {
        return result;
      }

      const hash = storageKey.args[0].toString();
      const status = rawStatus.unwrap();
      if (status.isUnrequested) {
        return [
          ...result,
          extractInfoFromUnrequested(status.asUnrequested, hash),
        ];
      } else if (status.isRequested) {
        return [
          ...result,
          extractInfoFromRequested(status.asRequested, hash),
        ].filter(Boolean);
      }
      return result;
    }, [])
    .filter((item) => isSameAddress(item.depositor, address));
}
