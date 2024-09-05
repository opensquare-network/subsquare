import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import extractVoteInfo from "../../democracy/referendum";
import {
  electorateSelector,
  fetchElectorate,
  referendumStatusSelector,
  setElectorate,
} from "../../../store/reducers/referendumSlice";
import useDemocracyTally from "../../../context/post/democracy/referendum/tally";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function useMaybeFetchElectorate(referendum, api) {
  const dispatch = useDispatch();
  const electorate = useSelector(electorateSelector);
  const referendumStatus = useSelector(referendumStatusSelector);
  const nowHeight = useSelector(chainOrScanHeightSelector);
  const tally = useDemocracyTally();

  const { voteFinished, voteFinishedHeight } = extractVoteInfo(
    referendum?.timeline,
  );
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
  }, [
    api,
    dispatch,
    voteFinishedHeight,
    nowHeight,
    possibleElectorate,
    voteFinished,
    tally.electorate,
    electorate,
  ]);

  return electorate;
}
