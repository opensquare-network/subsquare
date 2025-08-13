import { isNil } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import LoadableContent from "next-common/components/common/loadableContent";
import ForeignAssetsList from "./table";
import useAllForeignAssets from "../useAllForeignAssets";

function Summary({ assetsCount }) {
  return (
    <SummaryLayout>
      <SummaryItem title="Total Foreign Assets">
        <LoadableContent isLoading={isNil(assetsCount)}>
          {assetsCount}
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}

export default function AllForeignAssetsList() {
  const chainSettings = useChainSettings();
  const allForeignAssets = useAllForeignAssets();

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={{ title: "Foreign Assets" }}
      description={chainSettings.description}
      summary={<Summary assetsCount={allForeignAssets?.length} />}
    >
      <ForeignAssetsList assets={allForeignAssets} />
    </ListLayout>
  );
}
