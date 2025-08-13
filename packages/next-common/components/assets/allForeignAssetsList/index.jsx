import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import LoadableContent from "next-common/components/common/loadableContent";
import ForeignAssetsList from "./table";
import useAllForeignAssets from "../useAllForeignAssets";

function Summary({ assetsCount, loading }) {
  return (
    <SummaryLayout>
      <SummaryItem title="Total Foreign Assets">
        <LoadableContent isLoading={loading}>{assetsCount}</LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}

export default function AllForeignAssetsList() {
  const chainSettings = useChainSettings();
  const { data: allForeignAssets, loading } = useAllForeignAssets();

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={{ title: "Foreign Assets" }}
      description={chainSettings.description}
      summary={
        <Summary assetsCount={allForeignAssets?.length} loading={loading} />
      }
    >
      <ForeignAssetsList assets={allForeignAssets} loading={loading} />
    </ListLayout>
  );
}
