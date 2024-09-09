import { useAssetHubApi } from "next-common/context/assetHub";
import useQueryAllAssetMetadata from "next-common/hooks/assets/useQueryAllAssetMetadata";
import { createStateContext } from "react-use";
import { useEffect } from "react";

const [useAssetHubOnPolkadotMetadataMetadata, InnerProvider] = createStateContext();

function DataUpdater({ children }) {
  const api = useAssetHubApi();
  const allMetadata = useQueryAllAssetMetadata(api);
  const [, setAllAssetMetadata] = useAssetHubOnPolkadotMetadataMetadata();

  useEffect(() => {
    setAllAssetMetadata(allMetadata);
  }, [allMetadata, setAllAssetMetadata]);

  return children;
}

export function AssetHubOnPolkadotMetadataProvider({ children }) {
  return (
    <InnerProvider>
      <DataUpdater>
        {children}
      </DataUpdater>
    </InnerProvider>
  );
}

export function useAssetHubOnPolkadotMetadata() {
  const [metadata] = useAssetHubOnPolkadotMetadataMetadata();
  return metadata;
}
