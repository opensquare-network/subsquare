import { useAssetHubApi } from "next-common/context/assetHub";
import useQueryAllAssetMetadata from "next-common/hooks/assets/useQueryAllAssetMetadata";
import { createStateContext } from "react-use";
import { useEffect } from "react";

const [useAssetHubMetadataState, AssetHubMetadataStateProvider] =
  createStateContext();

function DataUpdater({ children }) {
  const api = useAssetHubApi();
  const allMetadata = useQueryAllAssetMetadata(api);
  const [, setAllAssetMetadata] = useAssetHubMetadataState();

  useEffect(() => {
    setAllAssetMetadata(allMetadata);
  }, [allMetadata, setAllAssetMetadata]);

  return children;
}

export function AssetHubMetadataProvider({ children }) {
  return (
    <AssetHubMetadataStateProvider>
      <DataUpdater>{children}</DataUpdater>
    </AssetHubMetadataStateProvider>
  );
}

export function useAssetHubMetadata() {
  const [metadata] = useAssetHubMetadataState();
  return metadata;
}
