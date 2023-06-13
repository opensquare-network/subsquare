import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearVotes,
  fetchVotes,
  votesSelector, votesTriggerSelector,
} from "../../store/reducers/gov2ReferendumSlice";
import useApi from "../hooks/useApi";

const referendumVoteFinishedStatusArray = [
  "Confirmed",
  "Cancelled",
  "Canceled",
  "Killed",
  "TimedOut",
  "Rejected",
];

function extractVoteInfo(timeline = []) {
  const timelineStatuses = timeline.map((item) => item.name);
  const index = timelineStatuses.findIndex((status) =>
    referendumVoteFinishedStatusArray.includes(status),
  );
  const voteFinished = index >= 0;
  let voteFinishedHeight = null;
  if (voteFinished) {
    voteFinishedHeight = timeline[index].indexer.blockHeight;
  }

  return {
    voteFinished,
    voteFinishedHeight,
  };
}

export default function useFetchVotes(referendum) {
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const votesTrigger = useSelector(votesTriggerSelector);
  const { voteFinishedHeight } = extractVoteInfo(referendum?.timeline);
  const referendumIndex = referendum?.referendumIndex;
  const trackId = referendum?.track;
  const api = useApi();

  const dispatch = useDispatch();

  useEffect(() => {
    if (api) {
      dispatch(fetchVotes(api, trackId, referendumIndex, voteFinishedHeight));
    }

    return () => dispatch(clearVotes());
  }, [api, dispatch, referendumIndex, voteFinishedHeight, votesTrigger]);

  return { allAye, allNay };
}
