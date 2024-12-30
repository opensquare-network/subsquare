import useQueryAssetHubAssets from "next-common/hooks/assetHub/useQueryAssetHubAssets";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";

export const AmbassadorAccount =
  "13wa8ddUNUhXnGeTrjYH8hYXF2jNdCJvgcADJakNvtNdGozX";

export default function useQueryAmbassadorBalance() {
  const asset = getAssetBySymbol("USDt");
  return useQueryAssetHubAssets(asset.id, AmbassadorAccount);
}
