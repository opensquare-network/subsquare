import { useMemo, useEffect } from "react";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { MapDataList } from "next-common/components/dataList";
import useTreasuryItems from "../../projects/hooks/useTreasuryItems";

export default function TreasuryItemsList({
  items = [],
  getIndex,
  apiPath,
  normalizeItem,
  normalize,
  columnsDef,
  pageSize = 10,
}) {
  const {
    page,
    component: pagination,
    setPage,
  } = usePaginationComponent(items.length, pageSize);

  useEffect(() => {
    setPage(1);
  }, [items, setPage]);

  const pagedItems = useMemo(
    () => items?.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  const indexes = useMemo(
    () => pagedItems.map(getIndex),
    [pagedItems, getIndex],
  );

  const { items: treasuryItems } = useTreasuryItems({
    indexes,
    apiPath,
    normalizeItem,
  });

  const normalizedData = useMemo(
    () => normalize(treasuryItems, pagedItems),
    [treasuryItems, pagedItems, normalize],
  );

  return (
    <>
      <MapDataList data={normalizedData} columnsDef={columnsDef} />
      {pagination}
    </>
  );
}
