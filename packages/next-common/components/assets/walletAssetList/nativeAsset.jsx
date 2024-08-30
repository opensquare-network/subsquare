import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import NativeAssetList from "./nativeAssetList";

export default function NativeAsset() {
  return (
    <div className="mb-1">
      <div className="pl-6">
        <span className="font-bold text-[16px] leading-[24px] text-textPrimary">
          Native Asset
        </span>
      </div>
      <div className="mt-4">
        <SecondaryCard>
          <NativeAssetList />
        </SecondaryCard>
      </div>
    </div>
  );
}
