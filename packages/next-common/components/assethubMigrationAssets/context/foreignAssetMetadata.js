import useQueryAllForeignAssetMetadata from "next-common/hooks/foreignAssets/useQueryAllForeignAssetMetadata";
import { createStateContext } from "react-use";
import { useEffect } from "react";

const [useAllForeignAssetMetadata, InnerProvider] = createStateContext();

function DataUpdater({ children }) {
  const { data: allMetadata } = useQueryAllForeignAssetMetadata();
  const [, setForeignAssetMetadata] = useAllForeignAssetMetadata();

  useEffect(() => {
    setForeignAssetMetadata(allMetadata);
  }, [allMetadata, setForeignAssetMetadata]);

  return children;
}

export function ForeignAssetMetadataProvider({ children }) {
  return (
    <InnerProvider>
      <DataUpdater>{children}</DataUpdater>
    </InnerProvider>
  );
}

export default useAllForeignAssetMetadata;
