import nextApi from "next-common/services/nextApi";
import { useEffect, useState, useMemo } from "react";
import { useChain } from "next-common/context/chain";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { announcementText } from "next-common/components/delegation/delegate/common/announcementText";

function useApiPath(pallet) {
  const chain = useChain();
  const address = useProfileAddress();

  const apiPath = useMemo(() => {
    if (!pallet || !address || !chain) {
      return null;
    }

    return `https://${chain}.subsquare.io/api/delegation/${pallet}/delegates/${address}`;
  }, [pallet, address, chain]);

  return apiPath;
}

export default function useDelegationAnnouncement(pallet) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiPath = useApiPath(pallet);

  useEffect(() => {
    if (!apiPath) {
      return;
    }

    setIsLoading(true);

    nextApi
      .fetch(apiPath)
      .then(({ result }) => {
        if (result) {
          const { shortDescription, longDescription } = result?.manifesto || {};
          setData({
            shortDescription: announcementText(shortDescription),
            longDescription: announcementText(longDescription),
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [apiPath]);

  return {
    data,
    isLoading,
  };
}
