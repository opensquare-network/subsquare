import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVoteCalls,
  voteCallsSelector,
} from "next-common/store/reducers/democracy/voteCalls";

export default function useDemocracyFetchVoteCalls(referendumIndex) {
  const { allAye = [], allNay = [] } = useSelector(voteCallsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVoteCalls(referendumIndex));
  }, [dispatch, referendumIndex]);

  return { allAye, allNay };
}
