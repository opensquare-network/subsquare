import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  votesSelector,
} from "../../store/reducers/gov2ReferendumSlice";
import useApi from "../hooks/useApi";
import {
  setIsLoadingVotes,
  fetchReferendaVotes,
  clearVotes,
} from "next-common/store/reducers/referenda/votes";
import { votesTriggerSelector } from "next-common/store/reducers/referenda/votes/selectors";

export default function useFetchVotes(referendum) {
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const votesTrigger = useSelector(votesTriggerSelector);
  const referendumIndex = referendum?.referendumIndex;
  const trackId = referendum?.track;
  const api = useApi();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) {
      return () => dispatch(clearVotes());
    }

    if (votesTrigger <= 1) {
      dispatch(setIsLoadingVotes(true));
    }

    dispatch(fetchReferendaVotes(api, trackId, referendumIndex));
    return () => dispatch(clearVotes());
  }, [api, dispatch, referendumIndex, votesTrigger]);

  return { allAye, allNay };
}
