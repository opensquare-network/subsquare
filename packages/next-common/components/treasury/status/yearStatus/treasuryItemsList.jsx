import { useMemo, useEffect } from "react";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { MapDataList } from "next-common/components/dataList";
import useTreasuryItems from "../../projects/hooks/useTreasuryItems";
import { isEmpty } from "lodash-es";

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
  } = usePaginationComponent(items.length, pageSize, { buttonMode: true });

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

  const { items: treasuryItems, loading } = useTreasuryItems({
    indexes,
    apiPath,
    normalizeItem,
  });

  const normalizedData = useMemo(
    () =>
      normalize(
        treasuryItems.map((item) => {
          const pagedItem =
            pagedItems.find(
              (pagedItem) => getIndex(pagedItem) === item.index,
            ) ?? {};
          return {
            ...item,
            ...pagedItem,
          };
        }),
      ),
    [treasuryItems, pagedItems, normalize, getIndex],
  );

  return (
    <>
      <MapDataList
        data={normalizedData}
        columnsDef={columnsDef}
        loading={isEmpty(normalizedData) && loading}
      />
      {pagination}
    </>
  );
}
