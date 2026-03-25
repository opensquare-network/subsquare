import { useMemo } from "react";

import useCall from "next-common/utils/hooks/useCall.js";
import { useContextApi } from "next-common/context/api";
import {
  createNoPreimageBytesResult,
  createResult,
  getPreimageHash,
} from "./useOldPreimageCommon";
import { getBytesParams } from "./usePreimageCommon";

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
  return useMemo(() => {
    let result;

    if (resultPreimageFor) {
      if (optBytes) {
        result = createResult(resultPreimageFor, optBytes);
      } else if (isBytesLoaded) {
        result = createNoPreimageBytesResult(resultPreimageFor);
      } else {
        result = resultPreimageFor;
      }
    } else if (resultPreimageHash) {
      if (inlineData) {
        result = createResult(resultPreimageHash, inlineData);
      } else {
        result = resultPreimageHash;
      }
    }

    const isPreimageLoaded = Boolean(inlineData) || isBytesLoaded;

    return [result, isStatusLoaded, isPreimageLoaded];
  }, [
    inlineData,
    optBytes,
    resultPreimageHash,
    resultPreimageFor,
    isBytesLoaded,
    isStatusLoaded,
  ]);
}
