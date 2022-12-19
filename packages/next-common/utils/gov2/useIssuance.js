import { useEffect } from "react";
import useApi from "../hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { latestHeightSelector } from "../../store/reducers/chainSlice";
import {
  fetchIssuanceForGov2,
  gov2IssuanceSelector,
} from "../../store/reducers/gov2ReferendumSlice";
import useReferendumVotingFinishHeight from "../../context/post/referenda/useReferendumVotingFinishHeight";

export default function useIssuance() {
  const api = useApi();
  const dispatch = useDispatch();
  const latestHeight = useSelector(latestHeightSelector);
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
  }, [votingFinishHeight, api, latestHeight, issuance]);

  return {
    issuance,
  };
}
