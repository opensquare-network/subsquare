import { MapDataList } from "next-common/components/dataList";
import { defaultPageSize } from "next-common/utils/constants";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useEffect, useState } from "react";
import { useCoretimeQuery } from "next-common/hooks/apollo";
import { GET_CORETIME_SALES } from "next-common/services/gql/coretime/consts";
import {
  idColumn,
  regionBeginColumn,
  regionEndColumn,
  timeRangeColumn,
  totalRevenueColumn,
  actionColumn,
  mobileStartTimeColumns,
  mobileEndTimeColumns,
} from "./columns";

function ResponsiveTable({ loading, dataSource }) {
  const desktopColumns = [
    idColumn,
    regionBeginColumn,
    regionEndColumn,
    timeRangeColumn,
    totalRevenueColumn,
    actionColumn,
  ];

  const mobileColumns = [
    idColumn,
    regionBeginColumn,
    regionEndColumn,
    mobileStartTimeColumns,
    mobileEndTimeColumns,
    totalRevenueColumn,
    actionColumn,
  ];

  return (
    <>
      <MapDataList
        className="max-sm:hidden"
        loading={loading}
        noDataText="No sales history"
        columnsDef={desktopColumns}
        data={dataSource}
      />
      <MapDataList
        className="hidden max-sm:block"
        loading={loading}
        noDataText="No sales history"
        columnsDef={mobileColumns}
        data={dataSource}
      />
    </>
  );
}

export default function SalesHistoryTable() {
  const [totalCount, setTotalCount] = useState(0);
  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const { data, loading } = useCoretimeQuery(GET_CORETIME_SALES, {
    variables: {
      offset: page - 1,
      limit: defaultPageSize,
    },
  });

  const { items = [], total = 0 } = data?.coretimeSales || {};

  const dataSource = items.filter((item) => item?.isFinal);

  useEffect(() => {
    if (loading) {
      return;
    }

    setTotalCount(total);
  }, [total, loading]);

  return (
    <div>
      <ResponsiveTable dataSource={dataSource} loading={loading} />
      {pageComponent}
    </div>
  );
}
