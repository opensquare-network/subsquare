import { useEffect, useState } from "react";

function decodeMetadataField(rawOnchainField) {
  try {
    return rawOnchainField.toUtf8();
  } catch {
    return rawOnchainField.toHuman();
  }
}

export default function useQueryAllAssetMetadata(api) {
  const [allMetadata, setAllMetadata] = useState();

  useEffect(() => {
    if (!api || !api.query?.assets?.metadata) {
      return;
    }

    api.query.assets.metadata.entries().then((entries) => {
      const normalizedMetadataArr = entries.map(([key, metadata]) => {
        return {
          assetId: key.args[0].toNumber(),
          symbol: decodeMetadataField(metadata.symbol),
          name: decodeMetadataField(metadata.name),
          decimals: metadata.decimals.toNumber(),
          isFrozen: metadata.isFrozen.toJSON(),
        };
      });
      setAllMetadata(normalizedMetadataArr);
    });
  }, [api]);

  return allMetadata;
}
