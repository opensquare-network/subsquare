import NativeAsset from "next-common/components/assets/nativeAsset";
import Assets from "next-common/components/assets/walletAssetList/assets";
import Transfers from "next-common/components/assets/walletAssetList/transfers";
import ForeignAssets from "next-common/components/assets/foreignAssets";
import AssetHubTabs from "next-common/components/assets/tabs/index";
import AssetsAccountHeader from "next-common/components/assets/walletAssetList/headContent";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";

export default function AssetsAccount() {
  return (
    <div className="flex flex-col gap-[16px]">
      <NeutralPanel className="p-6 space-y-4">
        <AssetsAccountHeader />
      </NeutralPanel>
      <NativeAsset />
      <AssetHubTabs>
        <Assets />
        <Transfers />
      </AssetHubTabs>
      <ForeignAssets />
    </div>
  );
}
