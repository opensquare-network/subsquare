// import AssetsOverview from "./overview";
import ListLayout from "next-common/components/layout/ListLayout";
import { AssetHubTabsProvider } from "next-common/components/assets/context/assetHubTabsProvider";
import HeadContent from "./headContent";

export default function AssethubMigrationAssets() {
  return (
    <AssetHubTabsProvider>
      <ListLayout seoInfo={{ title: "" }} headContent={<HeadContent />}>
        <div className="flex flex-col gap-[16px]"></div>
      </ListLayout>
    </AssetHubTabsProvider>
  );
}
