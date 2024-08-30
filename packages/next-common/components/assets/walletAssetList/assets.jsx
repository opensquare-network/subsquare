import useMyAssets from "next-common/components/assets/useAssets";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "next-common/components/assets/assetsList";
import { useEffect } from "react";

export default function Assets({ setTotalCount }) {
  const assets = useMyAssets();
  const nonNativeAssets = assets?.filter(
    (asset) => !asset?.type || asset?.type !== "native",
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
