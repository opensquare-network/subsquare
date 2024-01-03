import useDemocracyTally from "../../context/post/democracy/referendum/tally";
import { useEffect, useState } from "react";
import useDemocracyVoteFinishedHeight from "../../context/post/democracy/referendum/voteFinishedHeight";
import { useOnchainData } from "../../context/post";
import useApi from "../../utils/hooks/useApi";
import useIsMounted from "../../utils/hooks/useIsMounted";
import { useDispatch } from "react-redux";
import {
  fetchVotes,
  incVotesTrigger,
} from "next-common/store/reducers/democracy/votes";
import { sleep } from "next-common/utils";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";

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

export default function useSubDemocracyTally() {
  const api = useApi();
  const { referendumIndex } = useOnchainData();
  const finishedHeight = useDemocracyVoteFinishedHeight();
  const contextTally = useDemocracyTally();
  const [tally, setTally] = useState(contextTally);
  const isMounted = useIsMounted();

  const dispatch = useDispatch();

  useEffect(() => {
    if (finishedHeight || !api || !api.query.democracy) {
      return;
    }

    let unsub;
    api.query.democracy
      .referendumInfoOf(referendumIndex, (info) => {
        if (!isMounted.current || !info || !info.isSome) {
          return;
        }

        const unwrapped = info.unwrap();
        if (!unwrapped.isOngoing) {
          return;
        }

        const ongoing = unwrapped.asOngoing;
        setTally(ongoing.tally.toJSON());

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
  }, [api, finishedHeight, referendumIndex, isMounted]);

  return tally;
}
