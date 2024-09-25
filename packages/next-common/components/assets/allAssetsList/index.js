import { useMemo } from "react";
import { isNil } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useChainSettings } from "next-common/context/chain";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import LoadableContent from "next-common/components/common/loadableContent";
import AssetsList from "./assetsList";
import { Title } from "../walletAssetList/index";
import useAllAssets from "../useAllAssets";

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

export default function AllAssetsList() {
  const chainSettings = useChainSettings();
  const assets = useAllAssets();
  const pageSize = 25;
  const { page, component: pagination } = usePaginationComponent(
    assets?.length || 0,
    pageSize,
  );
  const pagedAssets = useMemo(
    () => assets?.slice((page - 1) * pageSize, page * pageSize),
    [assets, page, pageSize],
  );

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      summary={<Summary assetsCount={assets?.length} />}
    >
      <div className="flex flex-col gap-[16px]">
        <Title assetsCount={assets?.length || 0} />
        <SecondaryCard>
          <AssetsList assets={pagedAssets} />
          {pagination}
        </SecondaryCard>
      </div>
    </ListLayout>
  );
}
