import useDemocracyTally from "../../context/post/democracy/referendum/tally";
import { useEffect, useState } from "react";
import useDemocracyVoteFinishedHeight from "../../context/post/democracy/referendum/voteFinishedHeight";
import { useOnchainData } from "../../context/post";
import useApi from "../../utils/hooks/useApi";
import useIsMounted from "../../utils/hooks/useIsMounted";

export default function useSubDemocracyTally() {
  const api = useApi();
  const { referendumIndex } = useOnchainData();
  const finishedHeight = useDemocracyVoteFinishedHeight();
  const contextTally = useDemocracyTally();
  const [tally, setTally] = useState(contextTally);
  const isMounted = useIsMounted();

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
      if (isMounted.current) {
        setTally(ongoing.tally.toJSON());
      }
    }).then(result => {
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
