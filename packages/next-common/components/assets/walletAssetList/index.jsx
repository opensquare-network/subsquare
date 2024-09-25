import ListLayout from "next-common/components/layout/ListLayout";
import { isNil } from "lodash-es";
import AssetHubTabs from "next-common/components/assets/tabs/index";
import HeadContent from "./headContent";
import NativeAsset from "./nativeAsset";
import Assets from "./assets";
import Transfers from "./transfers";
import { AssetHubTabsProvider } from "next-common/components/assets/context/assetHubTabsProvider";

export function Title({ assetsCount }) {
  return (
    <div className="flex mx-[24px] text16Bold gap-[4px]">
      <span className="text-textPrimary">Assets</span>
      {!isNil(assetsCount) && (
        <span className="text-textTertiary">{assetsCount || 0}</span>
      )}
    </div>
  );
}

export default function WalletAssetList() {
  return (
    <AssetHubTabsProvider>
      <ListLayout seoInfo={{ title: "" }} headContent={<HeadContent />}>
        <div className="flex flex-col gap-[16px]">
          <NativeAsset />
          <AssetHubTabs>
            <Assets />
            <Transfers />
          </AssetHubTabs>
        </div>
      </ListLayout>
    </AssetHubTabsProvider>
  );
}
