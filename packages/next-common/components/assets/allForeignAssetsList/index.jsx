import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import LoadableContent from "next-common/components/common/loadableContent";
import ForeignAssetsList from "./table";
import {
  AllForeignAssetsProvider,
  useAllForeignAssetsContext,
} from "next-common/context/foreignAssets/allForeignAssets";

function Summary() {
  const { allForeignAssets, loading } = useAllForeignAssetsContext();

  return (
    <SummaryLayout>
      <SummaryItem title="Total Foreign Assets">
        <LoadableContent isLoading={loading}>
          {allForeignAssets?.length}
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}

function AllForeignAssetsImpl() {
  const chainSettings = useChainSettings();

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={{ title: "Foreign Assets" }}
      description={chainSettings.description}
      summary={<Summary />}
    >
      <ForeignAssetsList />
    </ListLayout>
  );
}

export default function AllForeignAssetsList() {
  return (
    <AllForeignAssetsProvider>
      <AllForeignAssetsImpl />
    </AllForeignAssetsProvider>
  );
}
