import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

// TODO: filter
function filterBountiesData(items) {
  return items.filter(() => {
    return true;
  });
}

export default function useQueryBountiesData() {
  const api = useContextApi();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { loaded, value } = useCall(api?.derive.bounties?.bounties);

  useEffect(() => {
    if (!api || !loaded) {
      return;
    }

    const filteredData = filterBountiesData(value);

    setData(filteredData);
    setIsLoading(!loaded);
  }, [api, loaded, value]);

  return {
    bounties: data,
    bountiesCount: data?.length || 0,
    isLoading,
  };
}
