import { useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";

export default function useOnchainPeopleIdentityList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const api = useContextApi();
  const { value, loaded } = useCall(
    api?.query?.identity?.identityOf?.entries,
    [],
  );

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const results = (value || []).map(([storageKey, storageValue]) => {
      const address = storageKey?.args[0]?.toString();
      const { judgements = [] } = storageValue?.unwrap() || {};
      let status = "";

      if (judgements?.length >= 1) {
        if (judgements[0][1]?.isKnownGood || judgements[0][1]?.isReasonable) {
          status = "verified";
        } else if (
          judgements[0][1]?.isErroneous ||
          judgements[0][1]?.isLowQuality ||
          judgements[0][1]?.isUnknown ||
          judgements[0][1]?.isOutOfDate
        ) {
          status = "erroneous";
        } else {
          status = "unverified";
        }
      } else {
        status = "unverified";
      }

      return {
        address,
        ...storageValue?.toJSON(),
        status,
      };
    });

    setData(results);
    setIsLoading(false);
  }, [loaded, value]);

  return {
    isLoading,
    data,
  };
}
