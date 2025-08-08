import ForeignAssetsTable from "./table";
import ForeignAssetsTransfers from "./transfers";
import AssetHubTabs from "next-common/components/assets/tabs";
import { AssetHubTabsProvider } from "next-common/components/assets/context/assetHubTabsProvider";
import { TABS } from "next-common/components/assets/context/assetHubTabsProvider";
import { useChainSettings } from "next-common/context/chain";
import {
  MyForeignAssetsProvider,
  useMyForeignAssetsContext,
} from "next-common/context/foreignAssets";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

function ForeignAssetsWithTransfers() {
  return (
    <AssetHubTabsProvider>
      <AssetHubTabs customLabels={{ [TABS.assets]: "Foreign Assets" }}>
        <MyForeignAssetsProvider>
          <ForeignAssetsTable />
        </MyForeignAssetsProvider>
        <ForeignAssetsTransfers />
      </AssetHubTabs>
    </AssetHubTabsProvider>
  );
}

function ForeignAssetsHeader() {
  const { count } = useMyForeignAssetsContext();

  return (
    <TitleContainer className="justify-start gap-x-1">
      Foreign Asset
      <span className="text16Medium text-textTertiary">{count}</span>
    </TitleContainer>
  );
}

function ForeignAssetsWithoutTransfers() {
  return (
    <MyForeignAssetsProvider>
      <ForeignAssetsHeader />
      <ForeignAssetsTable />
    </MyForeignAssetsProvider>
  );
}

export default function ForeignAssets() {
  const { supportForeignAssets } = useChainSettings();

  if (!supportForeignAssets) {
    return <ForeignAssetsWithoutTransfers />;
  }

  return <ForeignAssetsWithTransfers />;
}
