import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import extractVoteInfo from "../../democracy/referendum";
import useApi from "../useApi";
import { fetchVotes } from "next-common/store/reducers/democracy/votes";
import { votesTriggerSelector } from "next-common/store/reducers/democracy/votes/selectors";

export default function useFetchVotes(referendum) {
  const { voteFinishedHeight } = extractVoteInfo(referendum?.timeline);
  const referendumIndex = referendum?.referendumIndex;
  const api = useApi();
  const voterTriggerCount = useSelector(votesTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (api) {
      dispatch(fetchVotes(api, referendumIndex, voteFinishedHeight));
    }
  }, [api, dispatch, referendumIndex, voteFinishedHeight, voterTriggerCount]);
}
