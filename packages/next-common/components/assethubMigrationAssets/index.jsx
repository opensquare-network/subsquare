import ListLayout from "next-common/components/layout/ListLayout";
import { AssetHubTabsProvider } from "next-common/components/assets/context/assetHubTabsProvider";
import HeaderTabs from "./headerTabs";
import AssetsAccount from "./account";
import AllAssetsList from "./allAssetsList";
import ForeignAssetsList from "./allForeignAssetsList";
import { AssetsTabProvider, useAssetsTab } from "./context/assetsTab";
import { useChainSettings } from "next-common/context/chain";

function AssetsContent() {
  const { activeValue } = useAssetsTab();

  if (activeValue === "account") {
    return <AssetsAccount />;
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
  const chain = useChainSettings();

  // TODO: title & description
  const title = `${chain.name} Assets`;
  const description = `${chain.name} Assets is the original ${chain.name} Asset Hub module`;

  return (
    <AssetHubTabsProvider>
      <AssetsTabProvider>
        <ListLayout
          seoInfo={{ title: "" }}
          title={title}
          description={description}
          customTabs={<HeaderTabs />}
        >
          <div className="flex flex-col gap-[16px]">
            <AssetsContent />
          </div>
        </ListLayout>
      </AssetsTabProvider>
    </AssetHubTabsProvider>
  );
}
