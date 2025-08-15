import { useMemo, useEffect, useState } from "react";
import { isNil } from "lodash-es";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import MobileForeignAssetsList from "./mobileForeignAssetsList";
import DesktopForeignAssetsList from "./desktopForeignAssetsList";
import useSearchAllForeignAssets, {
  SearchInput,
} from "../useSearchAllForeignAssets";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useAllForeignAssetsContext } from "next-common/context/foreignAssets/allForeignAssets";

function ForeignAssetsTitle() {
  const { allForeignAssets, loading } = useAllForeignAssetsContext();

  return (
    <TitleContainer className="justify-start gap-x-1">
      Foreign Asset
      {loading ? null : (
        <span className="text16Medium text-textTertiary">
          {allForeignAssets?.length || 0}
        </span>
      )}
    </TitleContainer>
  );
}

export default function ForeignAssetsList() {
  const { allForeignAssets } = useAllForeignAssetsContext();
  const { width } = useWindowSize();
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

  if (isNil(width)) {
    return null;
  }

  const TableComponent =
    width > 768 ? DesktopForeignAssetsList : MobileForeignAssetsList;

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="inline-flex w-full justify-between items-center pr-6">
        <ForeignAssetsTitle />
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <SecondaryCard>
        <TableComponent assets={pagedAssets} />
        {pagination}
      </SecondaryCard>
    </div>
  );
}
