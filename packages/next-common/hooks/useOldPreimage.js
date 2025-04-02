import { useMemo } from "react";

import { Option } from "@polkadot/types";
import {
  BN,
  BN_ZERO,
  formatNumber,
  isString,
  isU8a,
  objectSpread,
  u8aToHex,
} from "@polkadot/util";
import useCall from "next-common/utils/hooks/useCall.js";
import { useContextApi } from "next-common/context/api";

/**
 * @internal Determine if we are working with current generation (H256,u32)
 * or previous generation H256 params to the preimageFor storage entry
 */
export function getParamType(api) {
  if (
    api?.query.preimage &&
    api?.query.preimage.preimageFor &&
    api?.query.preimage.preimageFor.creator.meta.type.isMap
  ) {
    const { type } = api.registry.lookup.getTypeDef(
      api.query.preimage.preimageFor.creator.meta.type.asMap.key,
    );

    if (type === "H256") {
      return "hash";
    } else if (type === "(H256,u32)") {
      return "hashAndLen";
    } else {
      // we are clueless :()
    }
  }

  return "unknown";
}

/** @internal Unwraps a passed preimage hash into components */
export function getPreimageHash(api, hashOrBounded) {
  let proposalHash;
  let inlineData;

  if (isString(hashOrBounded)) {
    proposalHash = hashOrBounded;
  } else if (isU8a(hashOrBounded)) {
    proposalHash = hashOrBounded.toHex();
  } else {
    const bounded = hashOrBounded;

    if (bounded.isInline) {
      inlineData = bounded.asInline.toU8a(true);
      proposalHash = u8aToHex(api?.registry.hash(inlineData));
    } else if (hashOrBounded.isLegacy) {
      proposalHash = hashOrBounded.asLegacy.hash_.toHex();
    } else if (hashOrBounded.isLookup) {
      proposalHash = hashOrBounded.asLookup.hash_.toHex();
    } else {
      console.error(
        `Unhandled FrameSupportPreimagesBounded type ${hashOrBounded.type}`,
      );
    }
  }

  return {
    inlineData,
    paramsStatus: proposalHash && [proposalHash],
    proposalHash,
    resultPreimageHash: proposalHash && {
      count: 0,
      isCompleted: false,
      isHashParam: getParamType(api) === "hash",
      proposalHash,
      proposalLength: inlineData && new BN(inlineData.length),
      registry: api?.registry,
      status: null,
    },
  };
}

/** @internal Creates a final result */
export function createResult(api, interimResult, optBytes) {
  const callData = isU8a(optBytes) ? optBytes : optBytes.unwrapOr(null);

  const result = ({
    proposal,
    proposalLength,
    proposalWarning,
    proposalError,
  }) => {
    return objectSpread({}, interimResult, {
      isCompleted: true,
      proposal,
      proposalError,
      proposalLength: new BN(proposalLength || proposal?.encodedLength),
      proposalWarning,
    });
  };

  if (!callData) {
    return result({ proposalWarning: "No preimage bytes found" });
  }

  try {
    const tx = api.tx(callData.toString());
    const proposal = api.createType("Call", tx.method);
    if (tx.toHex() === callData.toString()) {
      return result({ proposal });
    }
  } catch {
    // skip
  }

  try {
    const proposal = api.registry.createType("Call", callData);

    const callLength = proposal.encodedLength;

    if (interimResult.proposalLength) {
      const storeLength = interimResult.proposalLength.toNumber();

      return result({
        proposal,
        proposalWarning:
          callLength !== storeLength
            ? `Decoded call length does not match on-chain stored preimage length (${formatNumber(
                callLength,
              )} bytes vs ${formatNumber(storeLength)} bytes)`
            : null,
      });
    } else {
      // for the old style, we set the actual length
      return result({ proposal });
    }
  } catch (error) {
    return result({
      proposalError: "Unable to decode preimage bytes into a valid Call",
    });
  }
}

/** @internal Helper to unwrap a deposit tuple into a structure */
function convertDeposit(deposit) {
  return deposit
    ? {
        amount: deposit[1],
        who: deposit[0].toString(),
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
        const { count, deposit, len } = asRequested;

        result.count = count.toNumber();
        result.deposit = convertDeposit(deposit.unwrapOr(null));
        result.proposalLength = len.unwrapOr(BN_ZERO);
        result.statusName = "requested";
      }
    } else if (result.status.isUnrequested) {
      const asUnrequested = result.status.asUnrequested;

      if (asUnrequested instanceof Option) {
        result.deposit = convertDeposit(
          // old-style conversion
          asUnrequested.unwrapOr(null),
        );
      } else {
        const { deposit, len } = result.status.asUnrequested;

        result.deposit = convertDeposit(deposit);
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

export default function useOldPreimage(hashOrBounded) {
  const api = useContextApi();

  // retrieve the status using only the hash of the image
  const { inlineData, paramsStatus, resultPreimageHash } = useMemo(
    () => (hashOrBounded ? getPreimageHash(api, hashOrBounded) : {}),
    [api, hashOrBounded],
  );

  const { value: optStatus, loaded: isStatusLoaded } = useCall(
    !inlineData && paramsStatus && api?.query.preimage?.statusFor,
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
