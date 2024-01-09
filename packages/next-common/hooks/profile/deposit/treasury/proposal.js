import useProfileAddress from "next-common/components/profile/useProfileAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { queryAddressDeposits as queryTreasuryProposalAddressDeposits } from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits/useFetchMyTreasuryProposalDeposits";
import { setProfileTreasuryProposalDeposits } from "next-common/store/reducers/profile/deposits/treasury";

export default function useFetchProfileTreasuryProposalDeposits() {
  const address = useProfileAddress();
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !address || !api.query?.treasury) {
      return;
    }

    queryTreasuryProposalAddressDeposits(api, address).then((data) => {
      dispatch(setProfileTreasuryProposalDeposits(data));
    });
  }, [api, address, dispatch]);
}
