import { useEffect, useState } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";

export default function useQueryAssetHubOnPolkadotMetadata() {
  const api = useAssetHubApi();
  const [allMetadata, setAllMetadata] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.assets.metadata.entries().then((entries) => {
      const normalizedMetadataArr = entries.map(([key, metadata]) => {
        return {
          assetId: key.args[0].toNumber(),
          symbol: metadata.symbol.toHuman(),
          name: metadata.name.toHuman(),
          decimals: metadata.decimals.toNumber(),
          isFrozen: metadata.isFrozen.toJSON(),
        };
      });
      setAllMetadata(normalizedMetadataArr);
    });
  }, [api]);

  return allMetadata;
}
