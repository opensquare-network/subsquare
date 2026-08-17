import { useContextApi } from "next-common/context/api";
import { useEffect, useMemo, useState } from "react";

export default function useSubscribeMultiForeignAssetAccounts(
  metadata,
  address,
) {
  const api = useContextApi();
  const query = api?.query?.foreignAssets?.account;
  const [multiAccounts, setMultiAccounts] = useState();

  const keys = useMemo(() => {
    if (!metadata || !address) {
      return null;
    }

    return metadata.map((asset) => [asset.storageLocation, address]);
  }, [address, metadata]);

  useEffect(() => {
    if (!keys || !query) {
      setMultiAccounts();
      return;
    }

    if (keys.length === 0) {
      setMultiAccounts([]);
      return;
    }

    let isActive = true;
    let unsubscribe;
    setMultiAccounts();

    async function subscribe() {
      try {
        const unsubscribeResult = await query.multi(keys, (results) => {
          if (isActive) {
            setMultiAccounts(results || []);
          }
        });

        if (isActive) {
          unsubscribe = unsubscribeResult;
        } else {
          unsubscribeResult?.();
        }
      } catch (error) {
        if (isActive) {
          console.error("Failed to subscribe foreign asset accounts", error);
          setMultiAccounts([]);
        }
      }
    }

    subscribe();

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, [keys, query]);

  return multiAccounts;
}
