import useDemocracyTally from "../../context/post/democracy/referendum/tally";
import { useEffect, useState } from "react";
import useDemocracyVoteFinishedHeight from "../../context/post/democracy/referendum/voteFinishedHeight";
import { useOnchainData } from "../../context/post";
import useApi from "../../utils/hooks/useApi";
import useIsMounted from "../../utils/hooks/useIsMounted";
import { triggerFetchDemocracyVotes } from "../../store/reducers/referendumSlice";
import { useDispatch } from "react-redux";

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
    api.query.democracy.referendumInfoOf(referendumIndex, (info) => {
      if (!isMounted.current || !info || !info.isSome) {
        return;
      }

      const unwrapped = info.unwrap();
      if (!unwrapped.isOngoing) {
        return;
      }

      const ongoing = unwrapped.asOngoing;
      setTally(ongoing.tally.toJSON());

      dispatch(triggerFetchDemocracyVotes());
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
