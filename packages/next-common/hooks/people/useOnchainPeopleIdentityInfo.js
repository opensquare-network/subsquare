import { useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";

export default function useOnchainPeopleIdentityInfo(identityData) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    directCount: 0,
    subCount: 0,
    verifiedCount: 0,
    unverifiedCount: 0,
    erroneousCount: 0,
  });
  const api = useContextApi();
  const { value: superValue, loaded: superLoaded } = useCall(
    api?.query?.identity?.superOf?.entries,
    [],
  );

  useEffect(() => {
    if (!superLoaded || !identityData) {
      return;
    }

    try {
      const subIdentityMap = new Map();
      (superValue || []).forEach(([storageKey, storageValue]) => {
        const subAddress = storageKey?.args[0]?.toString();
        const [mainAddress] = storageValue?.toJSON() || [];
        if (subAddress && mainAddress) {
          subIdentityMap.set(subAddress, mainAddress);
        }
      });

      const newStats = {
        directCount: 0,
        subCount: subIdentityMap.size,
        verifiedCount: 0,
        unverifiedCount: 0,
        erroneousCount: 0,
      };

      (identityData || []).forEach((item) => {
        if (subIdentityMap.has(item.address)) {
          return;
        }

        newStats.directCount++;

        if (item.status === "verified") {
          newStats.verifiedCount++;
        } else if (item.status === "unverified") {
          newStats.unverifiedCount++;
        } else if (item.status === "erroneous") {
          newStats.erroneousCount++;
        }
      });

      setStats(newStats);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }, [superLoaded, superValue, identityData]);

  return {
    isLoading,
    stats,
  };
}
