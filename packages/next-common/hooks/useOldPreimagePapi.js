import { useMemo } from "react";
import { useAsync } from "react-use";

import { Binary } from "polkadot-api";
import { useContextPapi } from "next-common/context/papi";
import {
  convertPapiDepositTuple,
  createPapiErrorResult,
  decodePreimageWithPapi,
  fetchPapiPreimageBytes,
  getPapiPreimageHash,
  getPapiStatusName,
  toPreimageCount,
  toPreimageLength,
} from "./useOldPreimageCommon";

function getBytesParams(interimResult, rawStatus) {
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
    result.deposit = convertPapiDepositTuple(value.deposit);
    result.proposalLength = toPreimageLength(value.len);
  } else if (type === "Unrequested") {
    result.deposit = convertPapiDepositTuple(value.deposit);
    result.proposalLength = toPreimageLength(value.len);
  } else {
    console.error(`Unhandled PAPI Preimage.StatusFor type: ${type}`);
  }

  return {
    resultPreimageFor: result,
  };
}

export default function useOldPreimagePapi(hashOrBounded) {
  const { api: papi, client } = useContextPapi();

  const { inlineData, resultPreimageHash } = useMemo(
    () => (hashOrBounded ? getPapiPreimageHash(hashOrBounded) : {}),
    [hashOrBounded],
  );

  const { value: resultPreimageFor, loading: statusLoading } =
    useAsync(async () => {
      if (inlineData) {
        return null;
      }

      if (!papi || !resultPreimageHash?.proposalHash) {
        return null;
      }

      const rawStatus = await papi.query.Preimage.StatusFor.getValue(
        Binary.fromHex(resultPreimageHash.proposalHash),
      );

      return getBytesParams(resultPreimageHash, rawStatus).resultPreimageFor;
    }, [papi, resultPreimageHash, inlineData]);

  const { value: optBytes, loading: bytesLoading } = useAsync(async () => {
    if (!resultPreimageFor || inlineData) {
      return null;
    }

    return await fetchPapiPreimageBytes(
      papi,
      resultPreimageFor.proposalHash,
      resultPreimageFor.proposalLength,
    );
  }, [papi, resultPreimageFor, inlineData]);

  const { value: papiResult, loading: papiLoading } = useAsync(async () => {
    const decodeTarget =
      resultPreimageFor && optBytes
        ? [resultPreimageFor, optBytes]
        : resultPreimageHash && inlineData
        ? [resultPreimageHash, inlineData]
        : null;

    if (!decodeTarget) {
      return null;
    }

    const [interimResult, bytes] = decodeTarget;

    if (!client) {
      return createPapiErrorResult(
        interimResult,
        "PAPI decode is not available",
      );
    }

    try {
      return (
        (await decodePreimageWithPapi(interimResult, bytes, client)) ||
        createPapiErrorResult(
          interimResult,
          "Unable to load metadata for PAPI decode",
        )
      );
    } catch {
      return createPapiErrorResult(
        interimResult,
        "Unable to decode preimage bytes into a valid Call",
      );
    }
  }, [client, resultPreimageFor, optBytes, resultPreimageHash, inlineData]);

  const isStatusLoaded = inlineData ? true : Boolean(papi) && !statusLoading;
  const resolvedBytesLoaded = inlineData
    ? true
    : Boolean(papi) && !bytesLoading;
  const hasBytesToDecode = Boolean(
    (resultPreimageFor && optBytes) || (resultPreimageHash && inlineData),
  );

  return useMemo(
    () => [
      papiResult || resultPreimageFor || resultPreimageHash || undefined,
      isStatusLoaded,
      hasBytesToDecode
        ? resolvedBytesLoaded && !papiLoading
        : resolvedBytesLoaded,
    ],
    [
      papiResult,
      resultPreimageFor,
      resultPreimageHash,
      isStatusLoaded,
      hasBytesToDecode,
      resolvedBytesLoaded,
      papiLoading,
    ],
  );
}
