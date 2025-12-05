import { MapDataList } from "next-common/components/dataList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useMemo, useEffect } from "react";

export default function ProjectItemsList({
  items = [],
  loading = false,
  columnsDef,
  noDataText,
}) {
  const pageSize = 10;
  const {
    page,
    component: pagination,
    setPage,
  } = usePaginationComponent(items?.length || 0, pageSize);

  useEffect(() => {
    setPage(1);
  }, [items, setPage]);

  const pagedItems = useMemo(
    () => items?.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return (
    <>
      <MapDataList
        noDataText={noDataText}
        loading={loading}
        data={pagedItems}
        columnsDef={columnsDef}
      />
      {pagination}
    </>
  );
}
