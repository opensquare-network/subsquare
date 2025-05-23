import { useAsync } from "react-use";
import { useState } from "react";
import useRefCallback from "next-common/hooks/useRefCallback";
import { backendApi } from "next-common/services/nextApi";

function useBountyDetailsData(id) {
  const [isLoading, setIsLoading] = useState(false);
  const [bountyData, setBountyData] = useState({
    bountyDetail: {},
    childBounties: {},
  });
  const pageSize = 5;

  const fetchInitData = useRefCallback(async (id) => {
    try {
      setIsLoading(true);
      const [{ result: bountyDetail }, { result: childBounties }] =
        await Promise.all([
          backendApi.fetch(`treasury/bounties/${id}`),
          backendApi.fetch(`treasury/bounties/${id}/child-bounties`, {
            pageSize,
          }),
        ]);

      setBountyData({
        bountyDetail,
        childBounties,
      });

      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  });

  useAsync(async () => {
    fetchInitData(id);
  }, []);

  return { isLoading, bountyData };
}

export default useBountyDetailsData;
