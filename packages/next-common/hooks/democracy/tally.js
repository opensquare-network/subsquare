import useDemocracyTally from "../../context/post/democracy/referendum/tally";
import { useEffect, useState } from "react";
import useDemocracyVoteFinishedHeight from "../../context/post/democracy/referendum/voteFinishedHeight";
import { useOnchainData } from "../../context/post";
import useApi from "../../utils/hooks/useApi";

export default function useSubDemocracyTally() {
  const api = useApi();
  const { referendumIndex } = useOnchainData();
  const finishedHeight = useDemocracyVoteFinishedHeight();
  const contextTally = useDemocracyTally();
  const [tally, setTally] = useState(contextTally);

  useEffect(() => {
    if (finishedHeight || !api || !api.query.democracy) {
      return;
    }

    let unsub;
    api.query.democracy.referendumInfoOf(referendumIndex, (info) => {
      if (!info || !info.isSome) {
        return;
      }

      const unwrapped = info.unwrap();
      if (!unwrapped.isOngoing) {
        return;
      }

      const ongoing = unwrapped.asOngoing;
      setTally(ongoing.tally.toJSON());
    }).then(result => {
      unsub = result;
    });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, finishedHeight, referendumIndex]);

  return tally;
}
