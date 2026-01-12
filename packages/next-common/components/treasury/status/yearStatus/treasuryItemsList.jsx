import { useMemo, useEffect } from "react";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { MapDataList } from "next-common/components/dataList";
import { isEmpty } from "lodash-es";
import useYearStatusColumnsDef from "../hooks/useYearStatusColumnsDef";

const pageSize = 10;

export default function TreasuryItemsList({
  items = [],
  getIndex,
  apiPath,
  normalizeItem,
  pageSize: customPageSize = pageSize,
  isTip = false,
}) {
  const {
    page,
    component: pagination,
    setPage,
  } = usePaginationComponent(items.length, customPageSize, {
    buttonMode: true,
  });

  useEffect(() => {
    setPage(1);
  }, [items, setPage]);

  const pagedItems = useMemo(
    () => items?.slice((page - 1) * customPageSize, page * customPageSize),
    [items, page, customPageSize],
  );

  const columnsDef = useYearStatusColumnsDef({
    getIndex,
    apiPath,
    normalizeItem,
    isTip,
  });

  return (
    <>
      <MapDataList
        data={pagedItems}
        columnsDef={columnsDef}
        loading={isEmpty(pagedItems)}
      />
      {pagination}
    </>
  );
}
