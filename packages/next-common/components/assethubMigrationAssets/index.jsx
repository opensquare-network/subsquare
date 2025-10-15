import ListLayout from "next-common/components/layout/ListLayout";
import { AssetHubTabsProvider } from "next-common/components/assets/context/assetHubTabsProvider";
import HeadContent from "./headContent";
import HeaderTabs from "./headerTabs";
import AssetsOverview from "./overview";
import AllAssetsList from "./allAssetsList";
import ForeignAssetsList from "./allForeignAssetsList";
import { AssetsTabProvider, useAssetsTab } from "./context/assetsTab";

function AssethubMigrationAssetsContent() {
  const { activeValue } = useAssetsTab();

  if (activeValue === "overview") {
    return <AssetsOverview />;
  }

  if (activeValue === "assets") {
    return <AllAssetsList />;
  }

  if (activeValue === "foreignAssets") {
    return <ForeignAssetsList />;
  }

  return null;
}

export default function AssethubMigrationAssets() {
  return (
    <AssetHubTabsProvider>
      <AssetsTabProvider>
        <ListLayout
          seoInfo={{ title: "" }}
          headContent={<HeadContent />}
          customTabs={<HeaderTabs />}
        >
          <div className="flex flex-col gap-[16px]">
            <AssethubMigrationAssetsContent />
          </div>
        </ListLayout>
      </AssetsTabProvider>
    </AssetHubTabsProvider>
  );
}
