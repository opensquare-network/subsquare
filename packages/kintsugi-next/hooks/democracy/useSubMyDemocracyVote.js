import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { useContextApi } from "next-common/context/api";

export async function getKintDemocracyDirectVote(
  api,
  address,
  referendumIndex,
) {
  const voting = await api.query.democracy?.votingOf(address);
  const jsonVoting = voting?.toJSON();
  const vote = (jsonVoting?.votes || []).find(
    (vote) => vote[0] === referendumIndex,
  )?.[1];

  return vote;
}

export default function useSubMyDemocracyVote(referendumIndex, address) {
  const api = useContextApi();

  const [isLoading, setIsLoading] = useState(false);
  const [vote, setVote] = useState(null);
  const isMounted = useMountedState();

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

        if (isMounted()) {
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
