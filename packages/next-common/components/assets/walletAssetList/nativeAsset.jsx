import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import NativeAssetsList from "./nativeAssetList";
import { useMyNativeAsset } from "next-common/components/assets/useMyAssets";

export default function NativeAsset() {
  const assets = useMyNativeAsset();

  return (
    <div className="mb-1">
      <div className="pl-6">
        <span className="font-bold text-[16px] leading-[24px] text-textPrimary">
          Native Asset
        </span>
      </div>
      <div className="mt-4">
        <SecondaryCard>
          <NativeAssetsList assets={assets} />
        </SecondaryCard>
      </div>
    </div>
  );
}
