import { queryPeopleIdentitiesInfo } from "next-common/services/gql/identity";
import { useCallback, useState, useEffect } from "react";

export default function usePeopleChainIdentityInfo() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const directResult = await queryPeopleIdentitiesInfo({
        identityType: "DIRECT",
      });
      const subResult = await queryPeopleIdentitiesInfo({
        identityType: "SUB",
      });
      const verifiedResult = await queryPeopleIdentitiesInfo({
        verificationStatus: "VERIFIED",
      });
      const unverifiedResult = await queryPeopleIdentitiesInfo({
        verificationStatus: "UNVERIFIED",
      });
      const erroneousResult = await queryPeopleIdentitiesInfo({
        verificationStatus: "ERRONEOUS",
      });

      setData({
        directCount: directResult?.data?.total || 0,
        subCount: subResult?.data?.total || 0,
        verifiedCount: verifiedResult?.data?.total || 0,
        unverifiedCount: unverifiedResult?.data?.total || 0,
        erroneousCount: erroneousResult?.data?.total || 0,
      });
    } catch (e) {
      console.error(e);
      setData({
        directCount: 0,
        subCount: 0,
        verifiedCount: 0,
        unverifiedCount: 0,
        erroneousCount: 0,
      });
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
