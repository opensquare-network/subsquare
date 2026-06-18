import { desktopColumns, mobileColumns } from "./columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRouter } from "next/router";
import useSearchComponent from "../../common/useSearchComponent";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";
import { addRouterQuery } from "next-common/utils/router";
import { flattenRecoveryData } from "../../recovery/hooks/useQueryAllRecoveryData";

export function searchAddress(list, keyword) {
  if (!keyword) {
    return list;
  }

  const lowerSearch = keyword.toLowerCase();
  return list.filter((row) => row.account?.toLowerCase().includes(lowerSearch));
}

export default function RecoveryFriendGroupsTable({
  data: rawData,
  loading: isLoading,
}) {
  const [navCollapsed] = useNavCollapsed();
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const { search = "", component: SearchBoxComponent } = useSearchComponent({
    placeholder: "Search by account address",
    className: "my-0 ml-2 flex-1 max-sm:w-full max-sm:ml-6",
    size: "small",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const flattenedData = useMemo(() => flattenRecoveryData(rawData), [rawData]);
  const filteredData = useMemo(
    () => searchAddress(flattenedData, search),
    [flattenedData, search],
  );

  const total = filteredData?.length || 0;

  useEffect(() => {
    setLoading(true);
  }, [page]);

  useEffect(() => {
    if (isLoading || isNil(rawData)) {
      return;
    }

    setTotalCount(total);
    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(filteredData?.slice(startIndex, endIndex));
    setLoading(false);
  }, [rawData, isLoading, page, total, filteredData]);

  useEffect(() => {
    addRouterQuery(router, "page", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.search]);

  useEffect(() => {
    addRouterQuery(router, "page", page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex w-full items-center pl-6 max-sm:flex-col max-sm:px-6 max-sm:gap-y-2">
        {SearchBoxComponent}
      </div>
      <SecondaryCard className="space-y-2">
        <ScrollerX>
          <MapDataList
            className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
            columnsDef={desktopColumns}
            data={dataList}
            loading={loading}
            noDataText="No data"
          />

          <MapDataList
            className={cn(
              "hidden",
              navCollapsed ? "max-sm:block" : "max-md:block",
            )}
            columnsDef={mobileColumns}
            data={dataList}
            loading={loading}
            noDataText="No data"
          />
        </ScrollerX>
        {total > 0 && pageComponent}
      </SecondaryCard>
    </div>
  );
}
