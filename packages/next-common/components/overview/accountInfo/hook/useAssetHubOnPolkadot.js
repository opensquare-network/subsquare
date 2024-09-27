import BigNumber from "bignumber.js";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";
import { useAssetHubMetadata } from "../context/assetHubOnPolkadotMetadataContext";
import { useAssetHubApi } from "next-common/context/assetHub";
import useSubscribeMultiAssetAccounts from "next-common/utils/hooks/useSubscribeMultiAssetAccounts";

export default function useAssetHubOnPolkadot() {
  const address = useRealAddress();
  const api = useAssetHubApi();
  const allMetadata = useAssetHubMetadata();
  const multiAccountKey = useMemo(
    () => allMetadata?.map((item) => [item.assetId, address]),
    [allMetadata, address],
  );
  const multiAccounts = useSubscribeMultiAssetAccounts(multiAccountKey, api);

  return useMemo(() => {
    if (!allMetadata || !multiAccounts || !address) {
      return null;
    }

    const assets = (allMetadata || []).reduce((result, item, index) => {
      const account = multiAccounts[index];
      if (account.isNone) {
        return result;
      }

      const unwrapped = account.unwrap();
      const balance = unwrapped.balance.toString();
      const transferrable = unwrapped.status.isFrozen ? 0 : balance;
      return [...result, { ...item, balance, transferrable }];
    }, []);

    return assets.filter((item) => !new BigNumber(item.balance || 0).isZero());
  }, [allMetadata, multiAccounts, address]);
}
