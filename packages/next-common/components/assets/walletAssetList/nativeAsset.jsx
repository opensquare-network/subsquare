import { useEffect, useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "next-common/components/assets/assetsList";

export default function NativeAsset({ setTotalCount, assets }) {
  const nativeAssets = useMemo(
    () => assets?.filter((asset) => asset?.type === "native"),
    [assets],
  );

  useEffect(() => {
    if (nativeAssets && setTotalCount) {
      setTotalCount(nativeAssets.length);
    }
  }, [nativeAssets, setTotalCount]);

  return (
    <div>
      <SecondaryCard>
        <AssetsList assets={nativeAssets} />
      </SecondaryCard>
    </div>
  );
}
