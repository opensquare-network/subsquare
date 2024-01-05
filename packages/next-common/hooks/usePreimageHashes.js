import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useMemo } from "react";
import { useSelector } from "react-redux";

function usePreimageHashesCommon(method) {
  const trigger = useSelector(preImagesTriggerSelector);

  const api = useApi();
  const [allStatus] = useCall(api?.query.preimage?.[method].entries, [], {
    trigger,
  });

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
