import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useMemo } from "react";
import { useSelector } from "react-redux";

function usePreimageHashesCommon(method) {
  const trigger = useSelector(preImagesTriggerSelector);

  const api = useApi();
  const preimageStatus = useCall(api?.query.preimage?.[method]?.entries, [], {
    trigger,
  });

  const [allStatus] = preimageStatus || [];

  return useMemo(
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
}

export function useOldPreimageHashes() {
  return usePreimageHashesCommon("statusFor");
}

export function usePreimageHashes() {
  return usePreimageHashesCommon("requestStatusFor");
}

export function useCombinedPreimageHashes() {
  const oldHashes = useOldPreimageHashes();
  const newHashes = usePreimageHashes();

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

  return hashes;
}
