import React, { useEffect, useState } from "react";
import { MapDataList } from "next-common/components/dataList";
import useTransfersHistory from "next-common/utils/hooks/useTransfersHistory";
import { useAssetsTransfersHistoryTokenColumn } from "./columns/token";
import { useAssetsTransfersHistoryIdColumn } from "./columns/id";
import { useAssetsTransfersHistoryFromColumn } from "./columns/from";
import { useAssetsTransfersHistoryToColumn } from "./columns/to";
import { useAssetsTransfersHistoryTimeAgeColumn } from "./columns/timeAge";
import { useAssetsTransfersHistoryAmountColumn } from "./columns/amount";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";

function useColumnsDef() {
  const tokenColumn = useAssetsTransfersHistoryTokenColumn();
  const idColumn = useAssetsTransfersHistoryIdColumn();
  const fromColumn = useAssetsTransfersHistoryFromColumn();
  const toColumn = useAssetsTransfersHistoryToColumn();
  const timeAgeColumn = useAssetsTransfersHistoryTimeAgeColumn();
  const amountColumn = useAssetsTransfersHistoryAmountColumn();

  return [
    tokenColumn,
    idColumn,
    fromColumn,
    toColumn,
    timeAgeColumn,
    amountColumn,
  ];
}

export default function AssetsTransfersHistory({ setTotalCount }) {
  const columnsDef = useColumnsDef();
  const [rowData, setRowData] = useState([]);
  const [total, setTotal] = useState(0);

  const { page, component: pageComponent } = usePaginationComponent(
    total,
    defaultPageSize,
  );

  const {
    value,
    loading,
    total: totalCount,
    error,
  } = useTransfersHistory(page - 1, defaultPageSize);

  useEffect(() => {
    if (value && !loading && !error) {
      setTotalCount(totalCount);
      setTotal(totalCount);
      setRowData(value || []);
    }
  }, [value, loading, error, setTotalCount, totalCount]);

  return (
    <div>
      <MapDataList
        columnsDef={columnsDef}
        data={rowData}
        loading={loading}
        noDataText="No data"
      />
      {pageComponent}
    </div>
  );
}
