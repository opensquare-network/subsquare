import { useEffect, useState } from "react";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";

export default function useQueryAllForeignAssetMetadata() {
  const api = useAssetHubApi();
  const [allMetadata, setAllMetadata] = useState();

  useEffect(() => {
    if (!api || !api.query?.foreignAssets?.metadata) {
      return;
    }

    api.query.foreignAssets.metadata.entries().then(async (entries) => {
      const metadataPromises = entries.map(async ([key, metadata]) => {
        const assetLocation = key.args[0];
        const assetId = assetLocation?.hash?.toString();

        if (!assetId) {
          return null;
        }

        return {
          assetId,
          location: assetLocation.toJSON(),
          symbol: metadata.symbol.toHuman(),
          name: metadata.name.toHuman(),
          decimals: metadata.decimals.toNumber(),
          isFrozen: metadata.isFrozen.toJSON(),
        };
      });

      const normalizedMetadataArr = (
        await Promise.all(metadataPromises)
      ).filter(Boolean);

      setAllMetadata(normalizedMetadataArr);
    });
  }, [api]);

  return allMetadata;
}
