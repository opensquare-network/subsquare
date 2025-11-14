import NativeAsset from "next-common/components/assethubMigrationAssets/nativeAsset";
import Assets from "next-common/components/assethubMigrationAssets/account/assets";
import Transfers from "next-common/components/assethubMigrationAssets/account/transfers";
import ForeignAssets from "next-common/components/assethubMigrationAssets/foreignAssets";
import AssetHubTabs from "next-common/components/assethubMigrationAssets/tabs/index";
import AssetsAccountHeader from "next-common/components/assethubMigrationAssets/account/header";
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
