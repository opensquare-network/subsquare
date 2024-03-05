import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import queryAddressReferendaDeposits from "next-common/hooks/account/deposit/referenda/deposits";
import {
  setProfileReferendaDecisionDeposits,
  setProfileReferendaSubmissionDeposits,
} from "next-common/store/reducers/profile/deposits/referenda";
import { useContextApi } from "next-common/context/api";

export default function useFetchProfileReferendaDeposits() {
  const address = useProfileAddress();
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !isPolkadotAddress(address) || !api.query?.referenda) {
      return;
    }

    queryAddressReferendaDeposits(api, address).then((data) => {
      const { submissionDeposits, decisionDeposits } = data;
      dispatch(setProfileReferendaSubmissionDeposits(submissionDeposits));
      dispatch(setProfileReferendaDecisionDeposits(decisionDeposits));
    });
  }, [api, address, dispatch]);
}
