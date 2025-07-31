import { useMemo } from "react";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubForeignAsset(assetLocation) {
  const api = useAssetHubApi();
  const realAddress = useRealAddress();

  const { result, loading } = useSubStorage(
    "foreignAssets",
    "account",
    [assetLocation, realAddress],
    { api },
  );

  const asset = useMemo(() => {
    if (!result?.isSome) {
      return null;
    }

    const unwrapped = result.unwrap();
    const balance = unwrapped?.balance?.toString();
    const transferrable = unwrapped?.status?.isFrozen ? "0" : balance;

    return {
      balance,
      transferrable,
    };
  }, [result]);

  return { asset, loading };
}
