import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import queryAddressDeposits from "next-common/hooks/account/deposit/referenda/deposits";
import {
  setMyFellowshipDecisionDeposits,
  setMyFellowshipSubmissionDeposits,
} from "next-common/store/reducers/myOnChainData/deposits/myFellowshipDeposits";

export default function useFetchMyFellowshipDeposits() {
  const realAddress = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !realAddress || !api.query?.fellowshipReferenda) {
      return;
    }

    queryAddressDeposits(api, realAddress, "fellowshipReferenda").then(
      (data) => {
        const { submissionDeposits, decisionDeposits } = data;
        dispatch(setMyFellowshipSubmissionDeposits(submissionDeposits));
        dispatch(setMyFellowshipDecisionDeposits(decisionDeposits));
      },
    );
  }, [api, realAddress, dispatch]);
}
