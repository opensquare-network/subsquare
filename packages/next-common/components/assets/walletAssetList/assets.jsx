import { useEffect } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "next-common/components/assets/assetsList";
import useMyAssets from "next-common/components/assets/useMyAssets";
import { useTotalCounts } from "next-common/components/assets/context/assetHubTabsProvider";

export default function Assets() {
  const assets = useMyAssets();
  const [, setTotalCount] = useTotalCounts();

  useEffect(() => {
    if (assets && setTotalCount) {
      setTotalCount("assets", assets.length);
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
