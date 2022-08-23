import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import extractVoteInfo from "../../utils/democracy/referendum";
import useIsMounted from "../../utils/hooks/useIsMounted";
import {
  fetchElectorate,
  fetchVotes,
  setElectorate,
} from "../../store/reducers/referendumSlice";
import { nowHeightSelector } from "../../store/reducers/chainSlice";

export function useReferendumVoteData(referendum, api) {
  const { voteFinished, voteFinishedHeight } = extractVoteInfo(
    referendum?.timeline
  );
  const referendumIndex = referendum?.referendumIndex;

  const [referendumStatus, setReferendumStatus] = useState(
    referendum?.status || referendum?.info?.ongoing || referendum?.meta
  );

  const possibleElectorate = referendumStatus?.tally?.electorate;

  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const [isLoadingReferendumStatus, setIsLoadingReferendumStatus] =
    useState(false);
  const nowHeight = useSelector(nowHeightSelector);

  useEffect(() => {
    if (api) {
      dispatch(fetchVotes(api, referendumIndex, voteFinishedHeight));
    }
  }, [api, dispatch, referendumIndex, voteFinishedHeight]);

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

  useEffect(() => {
    if (voteFinished) {
      return;
    }

    setIsLoadingReferendumStatus(true);
    api?.query.democracy
      .referendumInfoOf(referendum?.referendumIndex)
      .then((referendumInfo) => {
        const data = referendumInfo.toJSON();
        if (data?.ongoing && isMounted.current) {
          setReferendumStatus(data?.ongoing);
        }
      })
      .finally(() => {
        setIsLoadingReferendumStatus(false);
      });
  }, [api, referendum, isMounted, voteFinished]);

  return {
    referendumStatus,
    setReferendumStatus,
    isLoadingReferendumStatus,
    setIsLoadingReferendumStatus,
  };
}
