import { useEffect, useState } from "react";
import { useSubMyAsset } from "./useSubMyAsset";
import polkadot from "next-common/utils/consts/settings/polkadot";

const PolkadotAssetHubNativeToken = {
  symbol: polkadot.symbol,
  name: polkadot.name,
  decimals: polkadot.decimals,
  type: "native",
};

export function useMyAsset() {
  const balanceObj = useSubMyAsset();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (balanceObj) {
      setLoading(false);
    }
  }, [balanceObj]);

  return {
    loading,
    value: {
      ...PolkadotAssetHubNativeToken,
      ...balanceObj,
    },
  };
}
