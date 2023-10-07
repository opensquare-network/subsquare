import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../hooks/useApi";
import {
  clearVotes,
  fetchReferendaVotes,
} from "next-common/store/reducers/referenda/votes";
import { votesTriggerSelector } from "next-common/store/reducers/referenda/votes/selectors";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export default function useFetchVotes(referendum) {
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

    dispatch(fetchReferendaVotes(api, trackId, referendumIndex));

    return () => {
      dispatch(clearVotes());
    };
  }, [api, dispatch, finishedHeight, referendumIndex, votesTrigger]);
}
