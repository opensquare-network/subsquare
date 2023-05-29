import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import extractVoteInfo from "../../democracy/referendum";
import {
  electorateSelector,
  fetchElectorate,
  referendumStatusSelector,
  setElectorate,
} from "../../../store/reducers/referendumSlice";
import { nowHeightSelector } from "../../../store/reducers/chainSlice";
import useDemocracyTally from "../../../context/post/democracy/referendum/tally";
import useDemocracyVoteFinishedHeight from "../../../context/post/democracy/referendum/voteFinishedHeight";

export default function useMaybeFetchElectorate(referendum, api) {
  const dispatch = useDispatch();
  const electorate = useSelector(electorateSelector);
  const referendumStatus = useSelector(referendumStatusSelector);
  const nowHeight = useSelector(nowHeightSelector);
  const tally = useDemocracyTally();
  useDemocracyVoteFinishedHeight();

  const { voteFinished, voteFinishedHeight } = extractVoteInfo(referendum?.timeline);
  const possibleElectorate = referendumStatus?.tally?.electorate;

  useEffect(() => {
    if (voteFinished && tally?.electorate) {
      dispatch(setElectorate(tally.electorate));
      return;
    }

    if (!electorate && tally?.electorate) {
      dispatch(setElectorate(tally.electorate));
    }

    if (api) {
      dispatch(
        fetchElectorate(
          api,
          voteFinishedHeight || nowHeight,
          possibleElectorate,
        ),
      );
    }
  }, [api, dispatch, voteFinishedHeight, nowHeight, possibleElectorate]);

  return electorate;
}
