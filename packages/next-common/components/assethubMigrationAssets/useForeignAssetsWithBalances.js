import { useMemo } from "react";
import useAllForeignAssetMetadata from "next-common/components/assethubMigrationAssets/context/foreignAssetMetadata";
import { foreignAssetInfo } from "next-common/utils/consts/foreignAssets";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

const knownForeignAssetsMap = Object.freeze({
  [Chains.polkadotAssetHub]: foreignAssetInfo,
  [Chains.polkadot]: foreignAssetInfo,
  [Chains.kusamaAssetHub]: foreignAssetInfo,
  [Chains.kusama]: foreignAssetInfo,
});

export default function useSortedForeignAssetMetadata() {
  const [allMetadata] = useAllForeignAssetMetadata();
  const chain = useChain();

  return useMemo(() => {
    if (!allMetadata) {
      return null;
    }

    const knownForeignAssets = knownForeignAssetsMap[chain] || {};
    const knownAssetIds = Object.keys(knownForeignAssets);
    const knownAssets = knownAssetIds.reduce((result, assetId) => {
      const find = allMetadata.find((asset) => asset.assetId === assetId);
      if (find) {
        return [...result, find];
      }
      return result;
    }, []);
    const otherAssets = allMetadata.filter(
      (asset) => !knownAssetIds.includes(asset.assetId),
    );

    return [...knownAssets, ...otherAssets];
  }, [allMetadata, chain]);
}
