import ListLayout from "next-common/components/layout/ListLayout";
import { AssetHubTabsProvider } from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";
import AssetsAccount from "./account";
import AllAssetsList from "./allAssetsList";
import ForeignAssetsList from "./allForeignAssetsList";
import { AssetsTabProvider, useAssetsTab } from "./context/assetsTab";
import { AssetMetadataProvider } from "next-common/components/assethubMigrationAssets/context/assetMetadata";
import Tabs from "next-common/components/tabs";

const TABS = Object.freeze([
  {
    value: "account",
    label: "Account",
  },
  {
    value: "assets",
    label: "Assets",
  },
  {
    value: "foreign_assets",
    label: "Foreign Assets",
  },
]);

const TITLE_MAPS = Object.freeze({
  account: "Account assets",
  assets: "Assets",
  ["foreign_assets"]: "Foreign Assets",
});

const DESCRIPTION_MAPS = Object.freeze({
  account: "Connected user can check and manage various assets",
  assets: "All no fungible assets info",
  ["foreign_assets"]: "All foreign assets info",
});

function HeaderTabs() {
  const { activeValue, setActiveValue } = useAssetsTab();

  return (
    <div className="space-y-4 px-12 max-w-[1200px] max-sm:px-6 mx-auto">
      <Tabs
        activeTabValue={activeValue}
        tabs={TABS}
        tabsContentClassName="hidden"
        onTabClick={(tab) => {
          setActiveValue(tab.value);
        }}
      />
    </div>
  );
}

function AssetsContent() {
  const { activeValue } = useAssetsTab();

  if (activeValue === "account") {
    return <AssetsAccount />;
  } else if (activeValue === "assets") {
    return <AllAssetsList />;
  } else if (activeValue === "foreign_assets") {
    return <ForeignAssetsList />;
  } else {
    return null;
  }
}

function AssethubMigrationAssetsImpl() {
  const { activeValue } = useAssetsTab();

  return (
    <ListLayout
      seoInfo={{ title: "" }}
      title={TITLE_MAPS[activeValue]}
      description={DESCRIPTION_MAPS[activeValue]}
      customTabs={<HeaderTabs />}
    >
      <div className="flex flex-col gap-[16px]">
        <AssetMetadataProvider>
          <AssetsContent />
        </AssetMetadataProvider>
      </div>
    </ListLayout>
  );
}

export default function AssethubMigrationAssets() {
  return (
    <AssetHubTabsProvider>
      <AssetsTabProvider>
        <AssethubMigrationAssetsImpl />
      </AssetsTabProvider>
    </AssetHubTabsProvider>
  );
}
