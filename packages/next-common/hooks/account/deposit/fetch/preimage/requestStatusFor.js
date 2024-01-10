import { isSameAddress } from "next-common/utils";

function extractInfoFromUnrequested(unrequested, hash) {
  const depositor = unrequested.ticket[0].toString();
  const deposit = unrequested.ticket[1].toJSON();
  const len = unrequested.len.toNumber();

  return {
    hash,
    len,
    depositor,
    deposit,
    method: "requestStatusFor",
  };
}

function extractInfoFromRequested(requested, hash) {
  if (!requested.maybeTicket.isSome) {
    return null;
  }

  const ticket = requested.maybeTicket;
  const depositor = ticket[0].toString();
  const deposit = ticket[1].toJSON();
  const len = requested.maybeLen.isSome
    ? requested.maybeLen.unwrap().toNumber()
    : null; // should be an exception here. We should have the len info if there is a deposit.

  return {
    hash,
    len,
    depositor,
    deposit,
    method: "requestStatusFor",
  };
}

// new preimage status storage by Gain. https://github.com/paritytech/polkadot-sdk/pull/1363
export async function queryAddressPreimageDepositsWithRequestStatusFor(
  api,
  address,
) {
  const entries = await api?.query.preimage?.requestStatusFor?.entries();
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
          extractInfoFromRequested(status.asRequested, hash),
          ...result,
        ].filter(Boolean);
      }
    }, [])
    .filter((item) => isSameAddress(item.depositor, address));
}
