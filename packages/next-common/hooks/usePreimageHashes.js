import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import useCall from "next-common/utils/hooks/useCall";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useContextApi } from "next-common/context/api";

function usePreimageHashesCommon(method) {
  const trigger = useSelector(preImagesTriggerSelector);
  const api = useContextApi();

  const preimageHashesCall = api?.query?.preimage?.[method];

  const { value: allStatus } = useCall(preimageHashesCall?.entries, [], {
    trigger,
  });

  const hashes = useMemo(
    () =>
      (allStatus || []).map((item) => {
        const [
          {
            args: [hash],
          },
          status,
        ] = item;
        return [hash.toJSON(), status.toJSON()];
      }),
    [allStatus],
  );

  const loading = (preimageHashesCall !== undefined && !allStatus) || !api;

  return { hashes, loading };
}

export function useOldPreimageHashes() {
  return usePreimageHashesCommon("statusFor");
}

export function usePreimageHashes() {
  return usePreimageHashesCommon("requestStatusFor");
}

export function useCombinedPreimageHashes() {
  const { hashes: oldHashes, loading: oldLoading } = useOldPreimageHashes();
  const { hashes: newHashes, loading: newLoading } = usePreimageHashes();

  const combinedLoading = oldLoading || newLoading;

  const hashes = useMemo(() => {
    const hashes = newHashes.map((data) => ({
      data,
      method: "requestStatusFor",
    }));
    for (const item of oldHashes) {
      const [oldHash] = item;
      if (!newHashes.some(([newHash]) => newHash === oldHash)) {
        hashes.push({ data: item, method: "statusFor" });
      }
    }
    return hashes;
  }, [oldHashes, newHashes]);

  return { hashes, loading: combinedLoading };
}
