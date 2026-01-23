import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  electorateSelector,
  fetchElectorate,
  referendumStatusSelector,
  setElectorate,
} from "../../../store/reducers/referendumSlice";
import useDemocracyTally from "../../../context/post/democracy/referendum/tally";
import useChainOrScanHeight from "next-common/hooks/height";
import { useContextApi } from "next-common/context/api";
import useIsDemocracyVoteFinished from "next-common/context/post/democracy/referendum/isVoteFinished";

export default function useMaybeFetchElectorate() {
  const api = useContextApi();
  const dispatch = useDispatch();
  const electorate = useSelector(electorateSelector);
  const referendumStatus = useSelector(referendumStatusSelector);
  const nowHeight = useChainOrScanHeight();
  const tally = useDemocracyTally();
  const isVoteFinished = useIsDemocracyVoteFinished();
  const possibleElectorate = referendumStatus?.tally?.electorate;

  useEffect(() => {
    if (isVoteFinished && tally?.electorate) {
      dispatch(setElectorate(tally.electorate));
      return;
    }

    if (!electorate && tally?.electorate) {
      dispatch(setElectorate(tally.electorate));
    }

    if (possibleElectorate) {
      dispatch(setElectorate(possibleElectorate));
      return;
    }

    if (api && !isVoteFinished) {
      dispatch(fetchElectorate(api, nowHeight));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, dispatch, nowHeight, possibleElectorate]);

  return electorate;
}
