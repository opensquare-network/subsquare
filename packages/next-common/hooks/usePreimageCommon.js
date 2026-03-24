import { Option } from "@polkadot/types";
import { BN_ZERO, objectSpread } from "@polkadot/util";
import {
  convertPapiDepositTuple,
  getPapiStatusName,
  toPreimageCount,
  toPreimageLength,
} from "./useOldPreimageCommon";

function convertTicket(ticket) {
  return ticket
    ? {
        amount: ticket[1],
        who: ticket[0].toString(),
      }
    : undefined;
}

export function getBytesParams(interimResult, optStatus) {
  const result = objectSpread({}, interimResult, {
    status: optStatus.unwrapOr(null),
  });

  if (result.status) {
    if (result.status.isRequested) {
      const asRequested = result.status.asRequested;

      if (!(asRequested instanceof Option)) {
        const { count, maybeTicket, maybeLen } = asRequested;

        result.count = count.toNumber();
        result.ticket = convertTicket(maybeTicket.unwrapOr(null));
        result.proposalLength = maybeLen.unwrapOr(BN_ZERO);
        result.statusName = "requested";
      }
    } else if (result.status.isUnrequested) {
      const asUnrequested = result.status.asUnrequested;

      if (asUnrequested instanceof Option) {
        result.ticket = convertTicket(asUnrequested.unwrapOr(null));
      } else {
        const { ticket, len } = result.status.asUnrequested;

        result.ticket = convertTicket(ticket);
        result.proposalLength = len;
        result.statusName = "unrequested";
      }
    } else {
      console.error(
        `Unhandled PalletPreimageRequestStatus type: ${result.status.type}`,
      );
    }
  }

  return {
    paramsBytes: result.isHashParam
      ? [result.proposalHash]
      : [[result.proposalHash, result.proposalLength || BN_ZERO]],
    resultPreimageFor: result,
  };
}

export function getPapiBytesParams(interimResult, rawStatus) {
  const result = {
    ...interimResult,
    status: rawStatus,
  };

  if (!rawStatus) {
    return { resultPreimageFor: result };
  }

  const { type, value = {} } = rawStatus;
  result.statusName = getPapiStatusName(rawStatus);

  if (type === "Requested") {
    result.count = toPreimageCount(value.count);
    result.ticket = convertPapiDepositTuple(
      value.maybeTicket ?? value.maybe_ticket,
    );
    result.proposalLength = toPreimageLength(value.maybeLen ?? value.maybe_len);
  } else if (type === "Unrequested") {
    result.ticket = convertPapiDepositTuple(value.ticket);
    result.proposalLength = toPreimageLength(value.len);
  } else {
    console.error(`Unhandled PAPI Preimage.RequestStatusFor type: ${type}`);
  }

  return {
    resultPreimageFor: result,
  };
}
