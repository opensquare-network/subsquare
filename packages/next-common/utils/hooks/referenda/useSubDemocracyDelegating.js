import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useSubDemocracyDelegating(address) {
  const api = useContextApi();
  const [delegating, setDelegating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    let unsub;
    api.query.democracy
      ?.votingOf(address, (voting) => {
        setIsLoading(false);
        const jsonVoting = voting?.toJSON();
        if (!jsonVoting) {
          return setDelegating(null);
        }

        return setDelegating(jsonVoting?.delegating);
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [address, api]);

  return { delegating, isLoading };
}
