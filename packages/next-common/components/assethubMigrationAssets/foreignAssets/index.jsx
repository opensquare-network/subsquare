import ForeignAssetsTable from "./table";
import ForeignAssetsTransfers from "./transfers";
import AssetHubTabs from "next-common/components/assethubMigrationAssets/tabs";
import { AssetHubTabsProvider } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import { TABS } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import { useChainSettings } from "next-common/context/chain";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useTotalCounts } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import { ForeignAssetMetadataProvider } from "next-common/components/assethubMigrationAssets/context/foreignAssetMetadata";

function ForeignAssetsWithTransfers() {
  return (
    <AssetHubTabsProvider>
      <ForeignAssetMetadataProvider>
        <AssetHubTabs customLabels={{ [TABS.assets]: "Foreign Assets" }}>
          <ForeignAssetsTable />
          <ForeignAssetsTransfers />
        </AssetHubTabs>
      </ForeignAssetMetadataProvider>
    </AssetHubTabsProvider>
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
    <AssetHubTabsProvider>
      <ForeignAssetMetadataProvider>
        <ForeignAssetsHeader />
        <ForeignAssetsTable />
      </ForeignAssetMetadataProvider>
    </AssetHubTabsProvider>
  );
}

export default function ForeignAssets() {
  const { supportForeignAssets } = useChainSettings();

  if (!supportForeignAssets) {
    return <ForeignAssetsWithoutTransfers />;
  }

  return <ForeignAssetsWithTransfers />;
}
