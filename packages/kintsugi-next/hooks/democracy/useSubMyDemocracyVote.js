import useDemocracyVoteFinishedHeight from "next-common/context/post/democracy/referendum/voteFinishedHeight";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

export default function useSubMyDemocracyVote(referendumIndex, address) {
  const finishedHeight = useDemocracyVoteFinishedHeight();
  const api = useBlockApi(finishedHeight);

  const [isLoading, setIsLoading] = useState(false);
  const [vote, setVote] = useState(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api || !address || !api.query.democracy) {
      return;
    }

    let unsub;
    setIsLoading(true);
    api.query.democracy
      ?.votingOf(address, (voting) => {
        setIsLoading(false);
        const jsonVoting = voting?.toJSON();
        const vote = (jsonVoting?.votes || []).find(
          (vote) => vote[0] === referendumIndex,
        )?.[1];

        if (isMounted.current) {
          setVote(vote);
        }
      })
      .then((result) => (unsub = result))
      .finally(() => setIsLoading(false));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, referendumIndex, address, isMounted]);

  return {
    vote,
    isLoading,
  };
}
