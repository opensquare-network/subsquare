import ListLayout from "next-common/components/layout/ListLayout";
import { isNil } from "lodash-es";
import NativeAssetPanel from "next-common/components/assets/nativeAssetPanel/index";
import AssetHubTabs from "next-common/components/assets/tabs/index";
import HeadContent from "./headContent";
import NativeAsset from "./nativeAsset";
import Assets from "./assets";
import Transfers from "./transfers";
import useMyAssets from "next-common/components/assets/useMyAssets";

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
  const assets = useMyAssets();
  return (
    <ListLayout seoInfo={{ title: "" }} headContent={<HeadContent />}>
      <div className="flex flex-col gap-[16px]">
        <NativeAssetPanel>
          <NativeAsset assets={assets} />
        </NativeAssetPanel>
        <AssetHubTabs>
          <Assets assets={assets} />
          <Transfers />
        </AssetHubTabs>
      </div>
    </ListLayout>
  );
}
