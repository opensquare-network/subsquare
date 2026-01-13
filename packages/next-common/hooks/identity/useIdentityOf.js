import { useEffect, useMemo, useState } from "react";
import useSubStorage from "../common/useSubStorage";
import {
  fetchIdentityOf,
  defaultIdentityOfData,
  convertIdentity,
} from "./identityFetch";

export function useIdentityOf(api, address) {
  const { result, loading: isLoading } = useSubStorage(
    "identity",
    "identityOf",
    [address],
    { api },
  );
  const [isQueryLoading, setIsQueryLoading] = useState(isLoading);

  const isReady = useMemo(() => {
    return !!api && !!address;
  }, [api, address]);

  const [identity, setIdentity] = useState(defaultIdentityOfData);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    async function fetchIdentity() {
      if (!result || result.isNone) {
        try {
          // Subscription may have data returned as isNone. Here, to avoid errors, we need to get the data again.
          setIsQueryLoading(true);
          const apiResult = await fetchIdentityOf(api, address);
          setIdentity(apiResult);
        } catch (error) {
          console.error(error);
          setIdentity(defaultIdentityOfData);
        } finally {
          setIsQueryLoading(false);
        }
      } else {
        setIdentity(convertIdentity(result));
      }
    }

    fetchIdentity();
  }, [address, api, result, isReady]);

  return {
    ...identity,
    isLoading: isQueryLoading || isLoading || !isReady,
  };
}
