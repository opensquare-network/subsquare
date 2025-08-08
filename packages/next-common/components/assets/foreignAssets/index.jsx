import ForeignAssetsTable from "./table";
import ForeignAssetsTransfers from "./transfers";
import { MyForeignAssetsProvider } from "next-common/context/foreignAssets";
import AssetHubTabs from "next-common/components/assets/tabs";
import { AssetHubTabsProvider } from "next-common/components/assets/context/assetHubTabsProvider";
import { TABS } from "next-common/components/assets/context/assetHubTabsProvider";

// TODO: condition transfers tab
export default function ForeignAssets() {
  return (
    <MyForeignAssetsProvider>
      <AssetHubTabsProvider>
        <AssetHubTabs customLabels={{ [TABS.assets]: "Foreign Assets" }}>
          <ForeignAssetsTable />
          <ForeignAssetsTransfers />
        </AssetHubTabs>
      </AssetHubTabsProvider>
    </MyForeignAssetsProvider>
  );
}
