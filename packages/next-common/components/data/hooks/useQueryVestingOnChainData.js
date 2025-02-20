import { useEffect, useState } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";

export default function useQueryVestingOnChainData() {
  const api = useContextApi();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const { value, loaded } = useCall(api?.query?.vesting?.vesting?.entries, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const results = (value || []).map(([storageKey, value]) => {
      return {
        address: storageKey?.args[0]?.toString(),
        startingBlock: value?.toJSON()?.[0]?.startingBlock,
        perBlock: value?.toJSON()?.[0]?.perBlock,
        locked: value?.toJSON()?.[0]?.locked,
      };
    });

    setData(results);
    setIsLoading(false);
  }, [value, loaded]);

  return {
    data,
    isLoading,
  };
}
