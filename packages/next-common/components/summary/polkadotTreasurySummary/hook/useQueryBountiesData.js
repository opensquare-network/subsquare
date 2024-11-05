import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

function filterBountiesData(items) {
  return items.filter((item) => {
    const currentBounty = item?.bounty?.toJSON();
    const { status } = currentBounty;

    return status && ("active" in status || "funded" in status);
  });
}

export default function useQueryBountiesData() {
  const api = useContextApi();
  const [bounties, setBounties] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { loaded, value } = useCall(api?.derive.bounties?.bounties);

  useEffect(() => {
    if (!api || !loaded) {
      return;
    }

    const filteredData = filterBountiesData(value);

    setBounties(filteredData);
    setIsLoading(!loaded);
  }, [api, loaded, value]);

  return {
    bounties,
    bountiesCount: bounties?.length || 0,
    isLoading,
  };
}
