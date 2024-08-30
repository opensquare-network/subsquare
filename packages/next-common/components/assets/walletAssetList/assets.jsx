import { useEffect, useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "next-common/components/assets/assetsList";

export default function Assets({ setTotalCount, assets }) {
  const nonNativeAssets = useMemo(
    () => assets?.filter((asset) => !asset?.type || asset?.type !== "native"),
    [assets],
  );

  useEffect(() => {
    if (nonNativeAssets && setTotalCount) {
      setTotalCount(nonNativeAssets.length);
    }
  }, [nonNativeAssets, setTotalCount]);

  return (
    <div>
      <SecondaryCard>
        <AssetsList assets={nonNativeAssets} />
      </SecondaryCard>
    </div>
  );
}
