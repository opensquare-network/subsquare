import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";

export default function useSubDemocracyDelegatingWithPapi(address) {
  const papi = useContextPapiApi();
  const [delegating, setDelegating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!papi || !address) {
      return;
    }

    setIsLoading(true);
    papi.query.Democracy.VotingOf.getValue(address)
      .then((jsonVoting) => {
        setIsLoading(false);
        if (!jsonVoting || jsonVoting?.type !== "Delegating") {
          return setDelegating(null);
        }

        return setDelegating(jsonVoting?.value);
      })
      .catch(() => {
        setDelegating(null);
        setIsLoading(false);
      });
  }, [address, papi]);

  return { delegating, isLoading };
}
