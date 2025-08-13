import { useMemo, useEffect, useState } from "react";
import { isNil } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useChainSettings } from "next-common/context/chain";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import LoadableContent from "next-common/components/common/loadableContent";
import ForeignAssetsList from "./foreignAssetsList";
import { Title } from "../walletAssetList/index";
import useAllForeignAssets from "../useAllForeignAssets";
import useSearchAllForeignAssets, {
  SearchInput,
} from "./useSearchAllForeignAssets";

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
  const [searchValue, setSearchValue] = useState("");
  const filteredAssets = useSearchAllForeignAssets(
    allForeignAssets,
    searchValue,
  );

  const pageSize = 25;
  const {
    page,
    component: pagination,
    setPage,
  } = usePaginationComponent(filteredAssets?.length || 0, pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchValue, setPage]);

  const pagedAssets = useMemo(
    () => filteredAssets?.slice((page - 1) * pageSize, page * pageSize),
    [filteredAssets, page, pageSize],
  );

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={{ title: "Foreign Assets" }}
      description="System parachain on Polkadot network for creating and sending tokens and NFTs."
      summary={<Summary assetsCount={filteredAssets?.length} />}
    >
      <div className="flex flex-col gap-[16px]">
        <div className="inline-flex w-full justify-between items-center pr-6">
          <Title assetsCount={filteredAssets?.length || 0} />
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <SecondaryCard>
          <ForeignAssetsList assets={pagedAssets} />
          {pagination}
        </SecondaryCard>
      </div>
    </ListLayout>
  );
}
