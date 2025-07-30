import { useCallback, useState } from "react";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubForeignAsset(assetLocation) {
  const api = useAssetHubApi();
  const realAddress = useRealAddress();
  const [asset, setAsset] = useState(null);

  const { loading } = useSubStorage(
    "foreignAssets",
    "account",
    [assetLocation, realAddress],
    {
      api,
      callback: useCallback((optionalAsset) => {
        if (optionalAsset?.isSome) {
          const unwrapped = optionalAsset.unwrap();
          const balance = unwrapped?.balance?.toString();
          const isFrozen = unwrapped?.status?.isFrozen;
          const transferrable = isFrozen ? "0" : balance;

          setAsset({
            balance,
            isFrozen,
            transferrable,
          });
        } else {
          setAsset(null);
        }
      }, []),
    },
  );

  return { asset, loading };
}
