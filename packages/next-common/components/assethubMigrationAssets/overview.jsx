import NativeAsset from "next-common/components/assets/nativeAsset";
import Assets from "next-common/components/assets/walletAssetsList/assets";
import Transfers from "next-common/components/assets/walletAssetsList/transfers";
import ForeignAssets from "next-common/components/assets/foreignAssets";
import AssetHubTabs from "next-common/components/assets/tabs/index";

export default function AssetsOverview() {
  return (
    <div className="flex flex-col gap-[16px]">
      <NativeAsset />
      <AssetHubTabs>
        <Assets />
        <Transfers />
      </AssetHubTabs>
      <ForeignAssets />
    </div>
  );
}
