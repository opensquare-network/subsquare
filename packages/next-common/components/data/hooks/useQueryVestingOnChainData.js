import { useEffect, useState } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";

export default function useQueryVestingOnChainData() {
  const api = useContextApi();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const { value, loading } = useCall(api?.query?.vesting?.vesting?.entries, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const results = (value || []).map(([storageKey, value]) => {
      return {
        address: storageKey?.args[0]?.toString(),
        value: value.toJSON(),
        startingBlock: value?.toJSON()?.startingBlock,
        perBlock: value?.toJSON()?.perBlock,
        locked: value?.toJSON()?.locked,
      };
    });

    setData(results);
    setIsLoading(false);
  }, [value, loading]);

  return {
    data,
    isLoading,
  };
}
