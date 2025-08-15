import { usePageProps } from "next-common/context/page";
import AssetHubTabs from "next-common/components/assets/tabs/index";
import { AssetHubTabsProvider } from "next-common/components/assets/context/assetHubTabsProvider";
import { TABS } from "next-common/components/assets/context/assetHubTabsProvider";
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
    <AssetHubTabsProvider>
      <AssetHubTabs customLabels={{ [TABS.assets]: "Foreign Assets" }}>
        <ProfileForeignAssetsTable />
        <ProfileForeignAssetsTransfers />
      </AssetHubTabs>
    </AssetHubTabsProvider>
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
    <ProfileForeignAssetsProvider address={id}>
      <ProfileForeignAssetsImpl />
    </ProfileForeignAssetsProvider>
  );
}
