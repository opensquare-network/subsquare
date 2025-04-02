import { useMemo } from "react";

import { Option } from "@polkadot/types";
import { BN_ZERO, objectSpread } from "@polkadot/util";
import useCall from "next-common/utils/hooks/useCall.js";
import { createResult, getPreimageHash } from "./useOldPreimage";
import { useContextApi } from "next-common/context/api";

/** @internal Helper to unwrap a ticket tuple into a structure */
function convertTicket(ticket) {
  return ticket
    ? {
        amount: ticket[1],
        who: ticket[0].toString(),
      }
    : undefined;
}

/** @internal Returns the parameters required for a call to bytes */
function getBytesParams(interimResult, optStatus) {
  const result = objectSpread({}, interimResult, {
    status: optStatus.unwrapOr(null),
  });

  if (result.status) {
    if (result.status.isRequested) {
      const asRequested = result.status.asRequested;

      if (asRequested instanceof Option) {
        // FIXME Cannot recall how to deal with these
        // (unlike Unrequested below, didn't have an example)
      } else {
        const { count, maybeTicket, maybeLen } = asRequested;

        result.count = count.toNumber();
        result.ticket = convertTicket(maybeTicket.unwrapOr(null));
        result.proposalLength = maybeLen.unwrapOr(BN_ZERO);
        result.statusName = "requested";
      }
    } else if (result.status.isUnrequested) {
      const asUnrequested = result.status.asUnrequested;

      if (asUnrequested instanceof Option) {
        result.ticket = convertTicket(
          // old-style conversion
          asUnrequested.unwrapOr(null),
        );
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

export default function usePreimage(hashOrBounded) {
  const api = useContextApi();

  // retrieve the status using only the hash of the image
  const { inlineData, paramsStatus, resultPreimageHash } = useMemo(
    () => (hashOrBounded ? getPreimageHash(api, hashOrBounded) : {}),
    [api, hashOrBounded],
  );

  const { value: optStatus, loaded: isStatusLoaded } = useCall(
    !inlineData && paramsStatus && api?.query.preimage?.requestStatusFor,
    paramsStatus ? paramsStatus : [undefined],
  );

  // from the retrieved status (if any), get the on-chain stored bytes
  const { paramsBytes, resultPreimageFor } = useMemo(
    () =>
      resultPreimageHash && optStatus
        ? getBytesParams(resultPreimageHash, optStatus)
        : {},
    [optStatus, resultPreimageHash],
  );

  const { value: optBytes, loaded: isBytesLoaded } = useCall(
    paramsBytes && api?.query.preimage?.preimageFor,
    paramsBytes ? paramsBytes : [undefined],
    { cacheKey: `usePreimage/preimageFor/${hashOrBounded}` },
  );

  // extract all the preimage info we have retrieved
  return useMemo(
    () => [
      resultPreimageFor
        ? optBytes
          ? createResult(api, resultPreimageFor, optBytes)
          : resultPreimageFor
        : resultPreimageHash
        ? inlineData
          ? createResult(api, resultPreimageHash, inlineData)
          : resultPreimageHash
        : undefined,
      isStatusLoaded,
      isBytesLoaded,
    ],
    [
      api,
      inlineData,
      optBytes,
      resultPreimageHash,
      resultPreimageFor,
      isStatusLoaded,
      isBytesLoaded,
    ],
  );
}
