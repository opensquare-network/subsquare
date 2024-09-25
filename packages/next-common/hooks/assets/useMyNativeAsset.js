import polkadot from "next-common/utils/consts/settings/polkadot";
import { useMyAsset } from "./useMyAsset";

const PolkadotAssetHubNativeToken = {
  symbol: polkadot.symbol,
  name: polkadot.name,
  decimals: polkadot.decimals,
  type: "native",
};

export function useMyNativeAsset() {
  const { value, loading } = useMyAsset();

  return {
    loading,
    value: {
      ...PolkadotAssetHubNativeToken,
      ...value,
    },
  };
}
