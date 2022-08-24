import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReferendumStatus,
  isLoadingReferendumStatusSelector,
  referendumStatusSelector,
  setReferendumStatus
} from "../../../store/reducers/referendumSlice";
import extractVoteInfo from "../../democracy/referendum";

export default function useMaybeFetchReferendumStatus(referendum, api) {
  const dispatch = useDispatch();
  const { voteFinished } = extractVoteInfo(referendum?.timeline);
  const referendumStatus = useSelector(referendumStatusSelector);
  const isLoadingReferendumStatus = useSelector(isLoadingReferendumStatusSelector);

  useEffect(() => {
      dispatch(setReferendumStatus(referendum?.status || referendum?.info?.ongoing || referendum?.meta));
  }, [referendum]);

  useEffect(() => {
    if (voteFinished) {
      return;
    }
    dispatch(fetchReferendumStatus(api, referendum?.referendumIndex));
  }, [api, referendum?.referendumIndex, voteFinished]);

  return {
    referendumStatus,
    isLoadingReferendumStatus,
  };
}
