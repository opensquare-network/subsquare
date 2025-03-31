import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import getAddressTrackDelegations from "next-common/utils/hooks/referenda/useFetchProfileReferendaDelegations/addressDelegations";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

export default function useMyTargetReferendaDelegations() {
  const address = useRealAddress();
  const api = useContextApi();
  const profileAddress = useProfileAddress();
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address || !profileAddress) {
      return;
    }

    setIsLoading(true);

    getAddressTrackDelegations(api, address).then((delegations) => {
      const targetDelegations = delegations?.filter(
        (delegation) => delegation.target === profileAddress,
      );

      setResult(targetDelegations);
      setIsLoading(false);
    });
  }, [api, address, profileAddress]);

  return { result, isLoading };
}
