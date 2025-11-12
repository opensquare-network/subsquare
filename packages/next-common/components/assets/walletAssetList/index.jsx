import ListLayout from "next-common/components/layout/ListLayout";
import { isNil } from "lodash-es";
import AssetHubTabs from "next-common/components/assethubMigrationAssets/tabs/index";
import HeadContent from "../../assethubMigrationAssets/account/headContent";
import NativeAsset from "../../assethubMigrationAssets/nativeAsset";
import Assets from "../../assethubMigrationAssets/account/assets";
import Transfers from "./transfers";
import { AssetHubTabsProvider } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import ForeignAssets from "next-common/components/assets/foreignAssets";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";

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
    <MigrationConditionalApiProvider>
      <AssetHubTabsProvider>
        <ListLayout seoInfo={{ title: "" }} headContent={<HeadContent />}>
          <div className="flex flex-col gap-[16px]">
            <NativeAsset />
            <AssetHubTabs>
              <Assets />
              <Transfers />
            </AssetHubTabs>
            <ForeignAssets />
          </div>
        </ListLayout>
      </AssetHubTabsProvider>
    </MigrationConditionalApiProvider>
  );
}
