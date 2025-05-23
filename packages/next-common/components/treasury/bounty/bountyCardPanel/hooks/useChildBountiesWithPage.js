import { useState } from "react";
import useRefCallback from "next-common/hooks/useRefCallback";
import { backendApi } from "next-common/services/nextApi";

function useChildBountiesWithPage(id) {
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;
  const [childBountiesPageData, setChildBountiesPageData] = useState(null);

  const fetchChildBountiesWithPage = useRefCallback(async (page) => {
    try {
      setIsLoading(true);
      const { result } = await backendApi.fetch(
        `treasury/bounties/${id}/child-bounties`,
        {
          pageSize,
          page,
        },
      );
      setChildBountiesPageData(result);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  });

  return { isLoading, childBountiesPageData, fetchChildBountiesWithPage };
}

export default useChildBountiesWithPage;
