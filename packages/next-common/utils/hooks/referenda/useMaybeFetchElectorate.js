import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import extractVoteInfo from "../../democracy/referendum";
import {
  electorateSelector,
  fetchElectorate,
  referendumStatusSelector,
  setElectorate,
} from "../../../store/reducers/referendumSlice";
import { nowHeightSelector } from "../../../store/reducers/chainSlice";

export default function useMaybeFetchElectorate(referendum, api) {
  const dispatch = useDispatch();
  const electorate = useSelector(electorateSelector);
  const referendumStatus = useSelector(referendumStatusSelector);
  const nowHeight = useSelector(nowHeightSelector);

  const { voteFinishedHeight } = extractVoteInfo(referendum?.timeline);
  const possibleElectorate = referendumStatus?.tally?.electorate;

  useEffect(() => {
    if (possibleElectorate) {
      dispatch(setElectorate(possibleElectorate));
    } else if (api) {
      dispatch(
        fetchElectorate(
          api,
          voteFinishedHeight || nowHeight,
          possibleElectorate
        )
      );
    }
  }, [api, dispatch, voteFinishedHeight, nowHeight, possibleElectorate]);

  return electorate;
}
