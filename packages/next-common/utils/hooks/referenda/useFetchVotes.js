import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import extractVoteInfo from "../../democracy/referendum";
import {
  clearVotes,
  democracyVotesTriggerSelector,
  fetchVotes,
  setIsLoadingVotes,
  votesSelector,
} from "../../../store/reducers/referendumSlice";
import useApi from "../useApi";

export default function useFetchVotes(referendum) {
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const { voteFinishedHeight } = extractVoteInfo(referendum?.timeline);
  const referendumIndex = referendum?.referendumIndex;
  const api = useApi();
  const voterTriggerCount = useSelector(democracyVotesTriggerSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (api) {
      if (voterTriggerCount <= 1) {
        dispatch(setIsLoadingVotes(true));
      }
      dispatch(fetchVotes(api, referendumIndex, voteFinishedHeight));
    }

    return () => dispatch(clearVotes());
  }, [api, dispatch, referendumIndex, voteFinishedHeight, voterTriggerCount]);

  return { allAye, allNay };
}
