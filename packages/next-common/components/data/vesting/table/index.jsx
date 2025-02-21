import { mobileColumns, desktopColumns } from "./columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useQueryVestingData from "next-common/components/data/vesting/hooks/useQueryVestingData";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRouter } from "next/router";
import useFilterAllVesting from "../hooks/useFilterAllVesting";
import TableHeader from "next-common/components/data/common/tableHeader";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

export default function VestingExplorerTable() {
  const { data, isLoading: loading } = useQueryVestingData();
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const [navCollapsed] = useNavCollapsed();
  const { filteredVesting, total, isLoading } = useFilterAllVesting(
    data,
    loading,
  );

  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(total, defaultPageSize);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(filteredVesting?.slice(startIndex, endIndex));
  }, [filteredVesting, page, isLoading]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <TableHeader total={total} loading={isLoading} />
      <SecondaryCard className="space-y-2">
        <ScrollerX>
          <MapDataList
            className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
            columnsDef={desktopColumns}
            data={dataList}
            loading={isLoading}
            noDataText="No data"
          />

          <MapDataList
            className={cn(
              "hidden",
              navCollapsed ? "max-sm:block" : "max-md:block",
            )}
            columnsDef={mobileColumns}
            data={dataList}
            loading={isLoading}
            noDataText="No data"
          />
        </ScrollerX>
        {total > 0 && pageComponent}
      </SecondaryCard>
    </div>
  );
}
