import {
  convertPapiDepositTuple,
  toPreimageLength,
} from "next-common/hooks/useOldPreimageCommon";
import { isSameAddress } from "next-common/utils";

function extractInfoFromUnrequested(unrequested, hash) {
  const ticket = convertPapiDepositTuple(unrequested.ticket);
  if (!ticket) {
    return null;
  }

  return {
    hash,
    len: toPreimageLength(unrequested.len)?.toNumber() ?? null,
    depositor: ticket.who,
    deposit: ticket.amount.toString(),
    method: "requestStatusFor",
  };
}

function extractInfoFromRequested(requested, hash) {
  const ticket = convertPapiDepositTuple(
    requested.maybeTicket ?? requested.maybe_ticket,
  );
  if (!ticket) {
    return null;
  }

  return {
    hash,
    len:
      toPreimageLength(requested.maybeLen ?? requested.maybe_len)?.toNumber() ??
      null,
    depositor: ticket.who,
    deposit: ticket.amount.toString(),
    method: "requestStatusFor",
  };
}

export async function queryAddressPreimageDepositsWithRequestStatusForPapi(
  papi,
  address,
) {
  const entries = await papi?.query.Preimage?.RequestStatusFor?.getEntries?.();

  return (entries || [])
    .reduce((result, { keyArgs, value: status }) => {
      const hash = keyArgs?.[0]?.asHex?.() ?? keyArgs?.[0]?.toString();

      if (status.type === "Unrequested") {
        return [
          ...result,
          extractInfoFromUnrequested(status.value, hash),
        ].filter(Boolean);
      } else if (status.type === "Requested") {
        return [extractInfoFromRequested(status.value, hash), ...result].filter(
          Boolean,
        );
      }

      return result;
    }, [])
    .filter((item) => isSameAddress(item.depositor, address));
}
