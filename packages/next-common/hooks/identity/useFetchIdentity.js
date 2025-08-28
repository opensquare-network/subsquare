import { useEffect, useState } from "react";
import {
  convertIdentity,
  InitIdentityInfo,
  InitIdentityJudgements,
} from "./useIdentityOf";

export function useFetchIdentity(api, address) {
  const [isLoading, setIsLoading] = useState(true);

  const [identity, setIdentity] = useState({
    info: InitIdentityInfo,
    judgements: InitIdentityJudgements,
  });

  useEffect(() => {
    if (!api || !address) {
      return;
    }
    async function fetchIdentity() {
      try {
        setIsLoading(true);
        const apiResult = await api.query?.identity.identityOf(address);
        if (apiResult && !apiResult.isNone) {
          setIdentity(convertIdentity(apiResult));
        } else {
          setIdentity({
            info: InitIdentityInfo,
            judgements: InitIdentityJudgements,
          });
        }
      } catch (error) {
        console.error(error);
        setIdentity({
          info: InitIdentityInfo,
          judgements: InitIdentityJudgements,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchIdentity();
  }, [address, api]);

  return {
    ...identity,
    isLoading: isLoading,
  };
}
