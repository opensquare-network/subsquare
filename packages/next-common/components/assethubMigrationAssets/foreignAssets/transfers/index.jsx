import React, { useState, useEffect } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import useQueryForeignAssetTransfers from "next-common/hooks/foreignAssets/useQueryForeignAssetTransfers";
import { useUser } from "next-common/context/user";
import { useForeignAssetTransfersColumnsDef } from "./columns/index";

export default function ForeignAssetsTransfersTable({ address }) {
  const columnsDef = useForeignAssetTransfersColumnsDef();
  const user = useUser();
  const targetAddress = address || user?.address;
  const [totalCount, setTotalCount] = useState(0);
  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const {
    list = [],
    total,
    loading,
  } = useQueryForeignAssetTransfers(targetAddress, page - 1);

  useEffect(() => {
    if (loading) {
      return;
    }

    setTotalCount(total);
  }, [total, loading]);

  return (
    <SecondaryCard>
      <ScrollerX>
        <MapDataList
          columnsDef={columnsDef}
          data={list}
          loading={loading}
          noDataText="No data"
        />
      </ScrollerX>
      {pageComponent}
    </SecondaryCard>
  );
}
