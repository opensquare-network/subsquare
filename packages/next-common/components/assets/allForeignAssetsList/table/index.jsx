import { useMemo, useEffect, useState } from "react";
import { isNil } from "lodash-es";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import MobileForeignAssetsList from "./mobileForeignAssetsList";
import DesktopForeignAssetsList from "./desktopForeignAssetsLists";
import useSearchAllForeignAssets, {
  SearchInput,
} from "../useSearchAllForeignAssets";
import { Title } from "next-common/components/assets/walletAssetList";

export default function ForeignAssetsList({ assets: allAssets }) {
  const { width } = useWindowSize();
  const [searchValue, setSearchValue] = useState("");
  const filteredAssets = useSearchAllForeignAssets(allAssets, searchValue);

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
        <Title assetsCount={filteredAssets?.length || 0} />
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div>
        <TableComponent assets={pagedAssets} />
        {pagination}
      </div>
    </div>
  );
}
