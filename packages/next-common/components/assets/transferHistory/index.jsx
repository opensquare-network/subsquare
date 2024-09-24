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
import { useTransfersHistoryData } from "next-common/components/assets/context/assetHubTabsProvider";

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

export default function AssetsTransfersHistory() {
  const columnsDef = useColumnsDef();
  const {
    list = [],
    total,
    loading,
    setPage,
    page,
  } = useTransfersHistoryData();
  const { component: pageComponent } = usePaginationComponent(
    total,
    defaultPageSize,
    page - 1,
    setPage,
  );

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
