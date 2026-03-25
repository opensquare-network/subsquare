import { useMemo } from "react";
import { useAsync } from "react-use";

import { Binary } from "polkadot-api";
import { useContextPapi } from "next-common/context/papi";
import {
  createPapiErrorResult,
  createPapiLoadingResult,
  decodePreimageWithPapi,
  fetchPapiPreimageBytes,
  getPapiPreimageHash,
} from "./useOldPreimageCommon";
import { getPapiBytesParams } from "./usePreimageCommon";

export default function usePreimagePapi(hashOrBounded) {
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

      const rawStatus = await papi.query.Preimage.RequestStatusFor.getValue(
        Binary.fromHex(resultPreimageHash.proposalHash),
      );

      return getPapiBytesParams(resultPreimageHash, rawStatus)
        .resultPreimageFor;
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
      return createPapiLoadingResult(interimResult);
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
  const isApiLoading = Boolean(papiResult?.isApiLoading);

  return useMemo(
    () => [
      papiResult || resultPreimageFor || resultPreimageHash || undefined,
      isStatusLoaded,
      hasBytesToDecode
        ? resolvedBytesLoaded && !papiLoading && !isApiLoading
        : resolvedBytesLoaded,
    ],
    [
      isApiLoading,
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
