import { useState, useMemo } from "react";
import useMyRelatedSwitch from "../../common/useMyRelatedSwitch";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSearchComponent from "../../common/useSearchComponent";
import useSearchByAddressIdentity from "./useSearchByAddressIdentity";
import { isSameAddress } from "next-common/utils";

export default function useFilterAllVesting(vesting = [], initialLoading) {
  const { isOn: isMyRelated } = useMyRelatedSwitch();
  const [isLoading, setIsLoading] = useState(true);
  const address = useRealAddress();

  const { search = "" } = useSearchComponent();
  const searchedVesting = useSearchByAddressIdentity(search, vesting);

  const filteredVesting = useMemo(() => {
    if (initialLoading) {
      return;
    }

    let filteredVesting = searchedVesting;

    if (isMyRelated && address) {
      filteredVesting = searchedVesting.filter(({ address: vestingAddress }) =>
        isSameAddress(vestingAddress, address),
      );
    }

    setTimeout(() => {
      setIsLoading(false);
    });

    return filteredVesting;
  }, [initialLoading, searchedVesting, isMyRelated, address]);

  return { filteredVesting, total: filteredVesting?.length, isLoading };
}
