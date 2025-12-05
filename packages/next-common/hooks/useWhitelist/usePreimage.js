import { useContextApi } from "next-common/context/api";
import { useMemo } from "react";
import {
  BN,
  isString,
  isU8a,
  u8aToHex,
  objectSpread,
  formatNumber,
  BN_ZERO,
} from "@polkadot/util";
import useCall from "./useCall";

export default function usePreimage(hashOrBounded) {
  const api = useContextApi();

  // retrieve the status using only the hash of the image
  const { inlineData, paramsStatus, resultPreimageHash } = useMemo(
    () => (hashOrBounded && api ? getPreimageHash(api, hashOrBounded) : {}),
    [api, hashOrBounded],
  );

  // api.query.preimage.statusFor has been deprecated in favor of api.query.preimage.requestStatusFor.
  // To ensure we get all preimages correctly we query both storages. see: https://github.com/polkadot-js/apps/pull/10310
  const optStatus = useCall(
    !inlineData && paramsStatus && api.query.preimage?.statusFor,
    paramsStatus,
  );
  const optRequstStatus = useCall(
    !inlineData && paramsStatus && api.query.preimage?.requestStatusFor,
    paramsStatus,
  );
  const someOptStatus = optStatus?.isSome ? optStatus : optRequstStatus;

  // from the retrieved status (if any), get the on-chain stored bytes
  const { paramsBytes, resultPreimageFor } = useMemo(
    () =>
      resultPreimageHash && someOptStatus
        ? getBytesParams(resultPreimageHash, someOptStatus)
        : {},
    [someOptStatus, resultPreimageHash],
  );

  const optBytes = useCall(
    paramsBytes && api.query.preimage?.preimageFor,
    paramsBytes,
  );

  // extract all the preimage info we have retrieved
  return useMemo(
    () =>
      resultPreimageFor
        ? optBytes
          ? createResult(api, resultPreimageFor, optBytes)
          : resultPreimageFor
        : resultPreimageHash
        ? inlineData
          ? createResult(api, resultPreimageHash, inlineData)
          : resultPreimageHash
        : undefined,
    [api, inlineData, optBytes, resultPreimageHash, resultPreimageFor],
  );
}
/** @internal Unwraps a passed preimage hash into components */
function getPreimageHash(api, hashOrBounded) {
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
      proposalHash = u8aToHex(api.registry.hash(inlineData));
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
      status: null,
    },
  };
}

/** @internal Creates a final result */
function createResult(api, interimResult, optBytes) {
  const callData = isU8a(optBytes) ? optBytes : optBytes.unwrapOr(null);

  const result = (preimage) =>
    objectSpread({}, interimResult, {
      isCompleted: true,
      ...preimage,
    });

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
    //
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
      return result({
        proposal,
        proposalLength: new BN(callLength),
      });
    }
  } catch (error) {
    console.error(error);
  }

  return result({
    proposalError: "Unable to decode preimage bytes into a valid Call",
  });
}

/** @internal Returns the parameters required for a call to bytes */
function getBytesParams(interimResult, someOptStatus) {
  const result = objectSpread({}, interimResult, {
    status: someOptStatus.unwrapOr(null),
  });

  if (result.status) {
    if (result.status.isRequested) {
      const asRequested = result.status.asRequested;

      if (asRequested instanceof Option) {
        // FIXME Cannot recall how to deal with these
        // (unlike Unrequested below, didn't have an example)
      } else {
        result.count = asRequested.count.toNumber();
        result.deposit = convertDeposit(
          asRequested.maybeTicket
            ? asRequested.maybeTicket.unwrapOr(null)
            : asRequested.deposit.unwrapOr(null),
        );
        result.proposalLength = asRequested.maybeLen
          ? asRequested.maybeLen.unwrapOr(BN_ZERO)
          : asRequested.len.unwrapOr(BN_ZERO);
      }
    } else if (result.status.isUnrequested) {
      const asUnrequested = result.status.asUnrequested;

      if (asUnrequested instanceof Option) {
        result.deposit = convertDeposit(
          // old-style conversion
          asUnrequested.unwrapOr(null),
        );
      } else {
        result.deposit = convertDeposit(
          asUnrequested.ticket || asUnrequested.deposit,
        );
        result.proposalLength = asUnrequested.len;
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

/** @internal Helper to unwrap a deposit tuple into a structure */
function convertDeposit(deposit) {
  return deposit
    ? {
        amount: deposit[1],
        who: deposit[0].toString(),
      }
    : undefined;
}

function getParamType(api) {
  if (
    api.query.preimage &&
    api.query.preimage.preimageFor &&
    api.query.preimage.preimageFor.creator.meta.type.isMap
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
