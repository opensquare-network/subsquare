import useIsDemocracyVoteFinished from "next-common/context/post/democracy/referendum/isVoteFinished";
import { useEffect } from "react";
import { isNil } from "lodash-es";
import { useMountedState } from "react-use";
import { useDispatch } from "react-redux";
import { setReferendumStatus } from "next-common/store/reducers/referendumSlice";
import {
  fetchVotes,
  incVotesTrigger,
} from "next-common/store/reducers/democracy/votes";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import { useContextApi } from "next-common/context/api";

async function fetchDemocracyVotes10Times(api, dispatch, referendumIndex) {
  const blockTime =
    getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
    defaultBlockTime;
  const timers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // eslint-disable-next-line no-unused-vars
  for (const timer of timers) {
    dispatch(fetchVotes(api, referendumIndex));
    await sleep(blockTime);
  }
}

export default function useSubDemocracyReferendumStatus(referendumIndex) {
  const isVoteFinished = useIsDemocracyVoteFinished();
  const isMounted = useMountedState();
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || isVoteFinished) {
      return;
    }

    if (isNil(referendumIndex)) {
      throw new Error("No referendum index to subscribe referendum info");
    }

    let unsub;
    api.query.democracy
      ?.referendumInfoOf(referendumIndex, (optionalInfo) => {
        if (!isMounted() || !optionalInfo.isSome) {
          return;
        }

        const info = optionalInfo.unwrap();
        const ongoing = info.asOngoing;
        dispatch(setReferendumStatus(ongoing?.toJSON()));
        dispatch(incVotesTrigger());
        fetchDemocracyVotes10Times(api, dispatch, referendumIndex).then(() => {
          // votes updated 10 time, do nothing
        });
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, referendumIndex, isVoteFinished, isMounted, dispatch]);
}
