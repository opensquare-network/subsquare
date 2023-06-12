import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import extractVoteInfo from "../../democracy/referendum";
import {
  fetchVotes,
  votesSelector,
} from "../../../store/reducers/referendumSlice";
import useApi from "../useApi";
import { clearVotes } from "../../../store/reducers/referendumSlice";

export default function useFetchVotes(referendum) {
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const { voteFinishedHeight } = extractVoteInfo(referendum?.timeline);
  const referendumIndex = referendum?.referendumIndex;
  const api = useApi();

  const dispatch = useDispatch();

  useEffect(() => {
    if (api) {
      dispatch(fetchVotes(api, referendumIndex, voteFinishedHeight));
    }

    return () => dispatch(clearVotes());
  }, [api, dispatch, referendumIndex, voteFinishedHeight]);

  return { allAye, allNay };
}
