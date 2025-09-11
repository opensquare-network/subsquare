import useQueryAllAssetMetadata from "next-common/hooks/assets/useQueryAllAssetMetadata";
import { useContextApi } from "next-common/context/api";
import { createStateContext } from "react-use";
import { useEffect } from "react";

const [useAllAssetMetadata, InnerProvider] = createStateContext();

function DataUpdater({ children }) {
  const api = useContextApi();
  const allMetadata = useQueryAllAssetMetadata(api);
  const [, setAssetMetadata] = useAllAssetMetadata();

  useEffect(() => {
    setAssetMetadata(allMetadata);
  }, [allMetadata, setAssetMetadata]);

  return children;
}

export function AssetMetadataProvider({ children }) {
  return (
    <InnerProvider>
      <DataUpdater>
        {children}
      </DataUpdater>
    </InnerProvider>
  );
}

export default useAllAssetMetadata;
