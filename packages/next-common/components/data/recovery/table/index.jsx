import { desktopColumns, mobileColumns } from "./columns";
import useQueryAllRecoveryData from "../hooks/useQueryAllRecoveryData";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRouter } from "next/router";
import useSearchComponent from "../../common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";
import { addRouterQuery } from "next-common/utils/router";

export default function RecoveryExplorerTable() {
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

  const { data, loading: isLoading } = useQueryAllRecoveryData();

  // Flatten: each account may have multiple friend groups, each becomes a row
  const flattenedData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const rows = [];
    for (const entry of data) {
      for (const group of entry.friendGroups) {
        rows.push({
          account: entry.account,
          index: group.index,
          inheritancePriority: group.inheritancePriority,
          friends: group.friends,
          friendsNeeded: group.friendsNeeded,
          inheritor: group.inheritor,
          inheritanceDelay: group.inheritanceDelay,
          cancelDelay: group.cancelDelay,
        });
      }
    }
    return rows;
  }, [data]);

  // Apply search filter on account field
  const filteredData = useMemo(() => {
    if (!search) {
      return flattenedData;
    }

    const lowerSearch = search.toLowerCase();
    return flattenedData.filter((row) =>
      row.account?.toLowerCase().includes(lowerSearch),
    );
  }, [flattenedData, search]);

  const total = useMemo(() => {
    return filteredData?.length || 0;
  }, [filteredData]);

  useEffect(() => {
    setLoading(true);
  }, [page]);

  useEffect(() => {
    if (isLoading || isNil(data)) {
      return;
    }

    setTotalCount(total);
    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(filteredData?.slice(startIndex, endIndex));
    setLoading(false);
  }, [data, isLoading, page, total, filteredData]);

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
      <div>
        <TitleContainer>
          <span>
            List
            <span className="text-textTertiary text16Medium ml-1">
              {!loading && total}
            </span>
          </span>
        </TitleContainer>
      </div>
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
