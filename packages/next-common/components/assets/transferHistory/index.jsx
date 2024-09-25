import React, { useState, useEffect } from "react";
import { MapDataList } from "next-common/components/dataList";
import { useAssetsTransfersHistoryTokenColumn } from "./columns/token";
import { useAssetsTransfersHistoryIdColumn } from "./columns/id";
import { useAssetsTransfersHistoryFromColumn } from "./columns/from";
import { useAssetsTransfersHistoryToColumn } from "./columns/to";
import { useAssetsTransfersHistoryTimeAgeColumn } from "./columns/timeAge";
import { useAssetsTransfersHistoryAmountColumn } from "./columns/amount";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import useQueryTransfersHistory from "./useQueryTransfersHistory";

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

export default function AssetsTransfersHistory({ address }) {
  const columnsDef = useColumnsDef();
  const [totalCount, setTotalCount] = useState(0);
  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const {
    list = [],
    total,
    loading,
  } = useQueryTransfersHistory(address, page - 1);

  useEffect(() => {
    if (!loading && total) {
      setTotalCount(total);
    }
  }, [total, loading]);

  return (
    <div>
      <MapDataList
        columnsDef={columnsDef}
        data={list}
        loading={loading}
        noDataText="No data"
      />
      {pageComponent}
    </div>
  );
}
