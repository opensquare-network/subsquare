import { useMemo, useEffect, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import AssetsList from "next-common/components/assethubMigrationAssets/allAssetsList/assetsList";
import useAllAssets from "next-common/components/assethubMigrationAssets/allAssetsList/useAllAssets";
import useSearchAllAssets, {
  SearchInput,
} from "next-common/components/assethubMigrationAssets/allAssetsList/useSearchAllAssets";
import { isNil } from "lodash-es";

function Title({ assetsCount }) {
  return (
    <div className="flex mx-[24px] text16Bold gap-[4px]">
      <span className="text-textPrimary">Assets</span>
      {!isNil(assetsCount) && (
        <span className="text-textTertiary">{assetsCount || 0}</span>
      )}
    </div>
  );
}

export default function AllAssetsList() {
  const allAssets = useAllAssets();
  const [searchValue, setSearchValue] = useState("");
  const filteredAssets = useSearchAllAssets(allAssets, searchValue);

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
    <div className="flex flex-col gap-[16px]">
      <div className="inline-flex w-full justify-between items-center pr-6">
        <Title assetsCount={filteredAssets?.length || 0} />
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <SecondaryCard>
        <AssetsList assets={pagedAssets} />
        {pagination}
      </SecondaryCard>
    </div>
  );
}
