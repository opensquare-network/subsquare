import React, { useEffect, memo } from "react";
import useMyAssets from "next-common/components/assets/useAssets";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "next-common/components/assets/assetsList.js";
import { TabLabel } from "next-common/components/assets/tabs/index";

const NativeAssetLabel = TabLabel;

const NativeAssetPanel = memo(({ children }) => {
  const [count, setCount] = React.useState("");

  return (
    <div className="mb-1">
      <div className="pl-6">
        <NativeAssetLabel label="Native Assets" count={count} isActive={true} />
      </div>
      <div className="mt-4">
        {React.cloneElement(children, { setTotalCount: setCount })}
      </div>
    </div>
  );
});

export default function NativeAsset({ setTotalCount }) {
  const assets = useMyAssets();
  const nativeAssets = assets?.filter(
    (asset) => asset?.type && asset?.type === "native",
  );

  useEffect(() => {
    if (nativeAssets && setTotalCount) {
      setTotalCount(nativeAssets.length);
    }
  }, [nativeAssets, setTotalCount]);

  return (
    <NativeAssetPanel>
      <SecondaryCard>
        <AssetsList assets={nativeAssets} />
      </SecondaryCard>
    </NativeAssetPanel>
  );
}
