import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVoteExtrinsics,
  voteExtrinsicsSelector,
} from "../../store/reducers/gov2ReferendumSlice";

export default function useFetchVoteExtrinsics(referendum) {
  const { allAye = [], allNay = [] } = useSelector(voteExtrinsicsSelector);
  const referendumIndex = referendum?.referendumIndex;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVoteExtrinsics(referendumIndex));
  }, [dispatch, referendumIndex]);

  return { allAye, allNay };
}
