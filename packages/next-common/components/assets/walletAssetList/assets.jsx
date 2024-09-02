import { useEffect } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "next-common/components/assets/assetsList";
import useMyAssets from "next-common/components/assets/useMyAssets";

export default function Assets({ setTotalCount }) {
  const assets = useMyAssets();

  useEffect(() => {
    if (assets && setTotalCount) {
      setTotalCount(assets.length);
    }
  }, [assets, setTotalCount]);

  return (
    <div>
      <SecondaryCard>
        <AssetsList assets={assets} />
      </SecondaryCard>
    </div>
  );
}
