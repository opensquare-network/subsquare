import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { votesSelector, } from "../../store/reducers/gov2ReferendumSlice";
import useApi from "../hooks/useApi";
import { fetchReferendaVotes, setIsLoadingVotes, } from "next-common/store/reducers/referenda/votes";
import { votesTriggerSelector } from "next-common/store/reducers/referenda/votes/selectors";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export default function useFetchVotes(referendum) {
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const votesTrigger = useSelector(votesTriggerSelector);
  const referendumIndex = referendum?.referendumIndex;
  const trackId = referendum?.track;
  const api = useApi();
  const finishedHeight = useReferendumVotingFinishHeight();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || finishedHeight) {
      return;
    }

    if (votesTrigger <= 1) {
      dispatch(setIsLoadingVotes(true));
    }

    dispatch(fetchReferendaVotes(api, trackId, referendumIndex));
  }, [api, dispatch, finishedHeight, referendumIndex, votesTrigger]);

  return { allAye, allNay };
}
