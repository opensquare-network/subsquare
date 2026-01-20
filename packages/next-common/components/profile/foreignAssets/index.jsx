import AssetHubTabs from "next-common/components/assethubMigrationAssets/tabs/index";
import { AssetHubTabsProvider } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import { TABS } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useChainSettings } from "next-common/context/chain";
import ProfileForeignAssetsTransfers from "./transfers";
import ProfileForeignAssetsTable from "./foreignAssetsList";
import { useTotalCounts } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import { ForeignAssetMetadataProvider } from "next-common/components/assethubMigrationAssets/context/foreignAssetMetadata";

function ForeignAssetsWithTransfers() {
  return (
    <AssetHubTabs customLabels={{ [TABS.assets]: "Foreign Assets" }}>
      <ProfileForeignAssetsTable />
      <ProfileForeignAssetsTransfers />
    </AssetHubTabs>
  );
}

function ForeignAssetsHeader() {
  const [totalCounts] = useTotalCounts();
  const count = totalCounts.assets || 0;

  return (
    <TitleContainer className="justify-start gap-x-1">
      Foreign Asset
      <span className="text16Medium text-textTertiary">{count}</span>
    </TitleContainer>
  );
}

function ForeignAssetsWithoutTransfers() {
  return (
    <>
      <ForeignAssetsHeader />
      <ProfileForeignAssetsTable />
    </>
  );
}

export default function ProfileForeignAssets() {
  const { supportForeignAssets } = useChainSettings();

  return (
    <AssetHubTabsProvider>
      <ForeignAssetMetadataProvider>
        {supportForeignAssets ? (
          <ForeignAssetsWithTransfers />
        ) : (
          <ForeignAssetsWithoutTransfers />
        )}
      </ForeignAssetMetadataProvider>
    </AssetHubTabsProvider>
  );
}
