import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import queryAddressDeposits from "next-common/hooks/account/deposit/referenda/deposits";
import {
  setProfileFellowshipDecisionDeposits,
  setProfileFellowshipSubmissionDeposits,
} from "next-common/store/reducers/profile/deposits/fellowship";
import { useContextApi } from "next-common/context/api";

export default function useFetchProfileFellowshipDeposits() {
  const address = useProfileAddress();
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !api ||
      !isPolkadotAddress(address) ||
      !api.query?.fellowshipReferenda
    ) {
      return;
    }

    queryAddressDeposits(api, address, "fellowshipReferenda").then((data) => {
      const { submissionDeposits, decisionDeposits } = data;
      dispatch(setProfileFellowshipSubmissionDeposits(submissionDeposits));
      dispatch(setProfileFellowshipDecisionDeposits(decisionDeposits));
    });
  }, [api, address, dispatch]);
}
