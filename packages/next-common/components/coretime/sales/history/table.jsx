import { MapDataList } from "next-common/components/dataList";
import { defaultPageSize } from "next-common/utils/constants";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { useEffect, useState } from "react";
import { useCoretimeQuery } from "next-common/hooks/apollo";
import { GET_CORETIME_SALES } from "next-common/services/gql/coretime/consts";
import {
  IDColumn,
  regionBeginColumn,
  regionEndColumn,
  timeRangeColumn,
  totalRevenueColumn,
  actionColumn,
} from "./columns";

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

  useEffect(() => {
    if (loading) {
      return;
    }

    setTotalCount(total);
  }, [total, loading]);

  // TODO: responsive columns
  const columns = [
    IDColumn,
    regionBeginColumn,
    regionEndColumn,
    timeRangeColumn,
    totalRevenueColumn,
    actionColumn,
  ];

  return (
    <div>
      <MapDataList
        loading={loading}
        noDataText="No sales history"
        columnsDef={columns}
        data={items}
      />
      {pageComponent}
    </div>
  );
}
