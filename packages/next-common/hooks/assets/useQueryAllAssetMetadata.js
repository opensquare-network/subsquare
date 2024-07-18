import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useQueryAllAssetMetadata() {
  const api = useContextApi();
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
