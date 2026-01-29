import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVotes } from "next-common/store/reducers/democracy/votes";
import { votesTriggerSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useContextApi } from "next-common/context/api";
import useIsDemocracyVoteFinished from "next-common/context/post/democracy/referendum/isVoteFinished";

export default function useFetchVotesWithOngoing(referendum) {
  const referendumIndex = referendum?.referendumIndex;
  const api = useContextApi();
  const voterTriggerCount = useSelector(votesTriggerSelector);
  const dispatch = useDispatch();
  const isVoteFinished = useIsDemocracyVoteFinished();

  useEffect(() => {
    if (api && !isVoteFinished) {
      dispatch(fetchVotes(api, referendumIndex));
    }
  }, [api, dispatch, referendumIndex, voterTriggerCount, isVoteFinished]);
}
