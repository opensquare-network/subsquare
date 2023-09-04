import { useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useApi from "next-common/utils/hooks/useApi";

export default function useSubMyDemocracyVote(referendumIndex, address) {
  const api = useApi();

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
