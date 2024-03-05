import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import queryAddressDeposits from "next-common/hooks/account/deposit/referenda/deposits";
import {
  setMyFellowshipDecisionDeposits,
  setMyFellowshipSubmissionDeposits,
} from "next-common/store/reducers/myOnChainData/deposits/myFellowshipDeposits";
import { useContextApi } from "next-common/context/api";

export default function useFetchMyFellowshipDeposits() {
  const realAddress = useRealAddress();
  const api = useContextApi();
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
