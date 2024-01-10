import useProfileAddress from "next-common/components/profile/useProfileAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import queryAddressReferendaDeposits from "next-common/hooks/account/deposit/referenda/deposits";
import {
  setProfileReferendaSubmissionDeposits,
  setProfileReferendaDecisionDeposits,
} from "next-common/store/reducers/profile/deposits/referenda";

export default function useFetchProfileReferendaDeposits() {
  const address = useProfileAddress();
  const api = useApi();
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
