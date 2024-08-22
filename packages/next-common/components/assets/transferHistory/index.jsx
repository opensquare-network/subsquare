import React, { useEffect } from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import useTransfersHistory from "next-common/utils/hooks/useTransfersHistory";
import { useAssetsTransfersHistoryTokenColumn } from "./columns/token";
import { useAssetsTransfersHistoryIdColumn } from "./columns/id";
import { useAssetsTransfersHistoryFromColumn } from "./columns/from";
import { useAssetsTransfersHistoryToColumn } from "./columns/to";
import { useAssetsTransfersHistoryTimeAgeColumn } from "./columns/timeAge";
import { useAssetsTransfersHistoryAmountColumn } from "./columns/amount";

export default function AssetsTransfersHistory({ setTotalCount }) {
  const tokenColumn = useAssetsTransfersHistoryTokenColumn();
  const idColumn = useAssetsTransfersHistoryIdColumn();
  const fromColumn = useAssetsTransfersHistoryFromColumn();
  const toColumn = useAssetsTransfersHistoryToColumn();
  const timeAgeColumn = useAssetsTransfersHistoryTimeAgeColumn();
  const amountColumn = useAssetsTransfersHistoryAmountColumn();

  const columnsDef = [
    tokenColumn,
    idColumn,
    fromColumn,
    toColumn,
    timeAgeColumn,
    amountColumn,
  ];
  const { value, loading } = useTransfersHistory();

  useEffect(() => {
    if (value) {
      setTotalCount(value?.items?.length || 0);
    }
  }, [value, loading]);

  const data = value?.items || [];
  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={data}
        loading={loading}
        noDataText="No data"
      />
    </ScrollerX>
  );
}
