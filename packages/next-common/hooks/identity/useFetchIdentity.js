import { useEffect, useState } from "react";
import { defaultIdentityOfData, fetchIdentityOf } from "./identityFetch";

export function useFetchIdentity(api, address) {
  const [isLoading, setIsLoading] = useState(true);

  const [identity, setIdentity] = useState(defaultIdentityOfData);

  useEffect(() => {
    if (!api || !address) {
      return;
    }
    async function fetchIdentity() {
      try {
        setIsLoading(true);
        const data = await fetchIdentityOf(api, address);
        setIdentity(data);
      } catch (error) {
        console.error(error);
        setIdentity(defaultIdentityOfData);
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
