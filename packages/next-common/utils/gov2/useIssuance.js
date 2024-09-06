import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIssuanceForGov2,
  gov2IssuanceSelector,
} from "../../store/reducers/gov2ReferendumSlice";
import useReferendumVotingFinishHeight from "../../context/post/referenda/useReferendumVotingFinishHeight";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useContextApi } from "next-common/context/api";

export default function useIssuance() {
  const api = useContextApi();
  const dispatch = useDispatch();
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const issuance = useSelector(gov2IssuanceSelector);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!issuance) {
      dispatch(fetchIssuanceForGov2(api, votingFinishHeight));
    }

    if (!votingFinishHeight && latestHeight % 10 === 0) {
      dispatch(fetchIssuanceForGov2(api));
    }
  }, [votingFinishHeight, api, latestHeight, issuance, dispatch]);

  return {
    issuance,
  };
}
