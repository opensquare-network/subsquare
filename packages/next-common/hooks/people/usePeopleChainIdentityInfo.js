import { queryPeopleIdentitiesInfo } from "next-common/services/gql/identity";
import { useCallback, useState, useEffect } from "react";

const INIT_DATA = {
  directCount: 0,
  subCount: 0,
  verifiedCount: 0,
  unverifiedCount: 0,
  erroneousCount: 0,
};

export default function usePeopleChainIdentityInfo() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(INIT_DATA);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [
        directResult,
        subResult,
        verifiedResult,
        unverifiedResult,
        erroneousResult,
      ] = await Promise.all([
        queryPeopleIdentitiesInfo({ identityType: "DIRECT" }),
        queryPeopleIdentitiesInfo({ identityType: "SUB" }),
        queryPeopleIdentitiesInfo({ verificationStatus: "VERIFIED" }),
        queryPeopleIdentitiesInfo({ verificationStatus: "UNVERIFIED" }),
        queryPeopleIdentitiesInfo({ verificationStatus: "ERRONEOUS" }),
      ]);

      setData({
        directCount: directResult?.data?.total || 0,
        subCount: subResult?.data?.total || 0,
        verifiedCount: verifiedResult?.data?.total || 0,
        unverifiedCount: unverifiedResult?.data?.total || 0,
        erroneousCount: erroneousResult?.data?.total || 0,
      });
    } catch (e) {
      console.error(e);
      setData(INIT_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isLoading,
    data,
  };
}
