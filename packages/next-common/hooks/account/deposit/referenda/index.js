import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import queryAddressDeposits from "next-common/hooks/account/deposit/referenda/deposits";
import {
  setDecisionDeposits,
  setSubmissionDeposits,
} from "next-common/store/reducers/myOnChainData/deposits/myReferendaDeposits";

export default function useFetchMyReferendaDeposits() {
  const realAddress = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !realAddress || !api.query?.referenda) {
      return;
    }

    queryAddressDeposits(api, realAddress).then((data) => {
      const { submissionDeposits, decisionDeposits } = data;
      dispatch(setSubmissionDeposits(submissionDeposits));
      dispatch(setDecisionDeposits(decisionDeposits));
    });
  }, [api, realAddress, dispatch]);
}
