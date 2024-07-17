import ListLayout from "next-common/components/layout/ListLayout";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "./assetsList";
import { useAllAssetMetadata } from "../context/assetMetadata";
import { useChainSettings } from "next-common/context/chain";
import { Title } from "../walletAssetList";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import useQueryAllAssetDetail from "next-common/hooks/assets/useQueryAllAssetDetail";
import { useMemo } from "react";

function Summary({ assetsCount }) {
  return (
    <SummaryLayout>
      <SummaryItem title="Total Assets">
        <LoadableContent isLoading={isNil(assetsCount)}>
          {assetsCount}
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}

function useAssets() {
  const metadata = useAllAssetMetadata();
  const details = useQueryAllAssetDetail();
  return useMemo(() => {
    if (!metadata || !details) {
      return;
    }

    return metadata.map((item) => {
      const detail = details.find((d) => d.assetId === item.assetId);
      return {
        ...item,
        ...detail,
      };
    });
  }, [metadata, details]);
}

export default function AllAssetsList({ seoInfo }) {
  const chainSettings = useChainSettings();
  const assets = useAssets();

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={seoInfo}
      description={chainSettings.description}
      summary={<Summary assetsCount={assets?.length} />}
    >
      <div className="flex flex-col gap-[16px]">
        <Title assetsCount={assets?.length || 0} />
        <SecondaryCard>
          <AssetsList assets={assets} />
        </SecondaryCard>
      </div>
    </ListLayout>
  );
}
