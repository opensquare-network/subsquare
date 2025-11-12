import { usePageProps } from "next-common/context/page";
import AssetHubTabs from "next-common/components/assethubMigrationAssets/tabs/index";
import { AssetHubTabsProvider } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import { TABS } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import {
  ProfileForeignAssetsProvider,
  useProfileForeignAssetsContext,
} from "./context";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useChainSettings } from "next-common/context/chain";
import ProfileForeignAssetsTransfers from "./transfers";
import ProfileForeignAssetsTable from "./foreignAssetsList";

function ForeignAssetsWithTransfers() {
  return (
    <AssetHubTabs customLabels={{ [TABS.assets]: "Foreign Assets" }}>
      <ProfileForeignAssetsTable />
      <ProfileForeignAssetsTransfers />
    </AssetHubTabs>
  );
}

function ForeignAssetsHeader() {
  const { count } = useProfileForeignAssetsContext();

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

function ProfileForeignAssetsImpl() {
  const { supportForeignAssets } = useChainSettings();
  if (!supportForeignAssets) {
    return <ForeignAssetsWithoutTransfers />;
  }

  return <ForeignAssetsWithTransfers />;
}

export default function ProfileForeignAssets() {
  const { id } = usePageProps();

  return (
    <AssetHubTabsProvider>
      <ProfileForeignAssetsProvider address={id}>
        <ProfileForeignAssetsImpl />
      </ProfileForeignAssetsProvider>
    </AssetHubTabsProvider>
  );
}
