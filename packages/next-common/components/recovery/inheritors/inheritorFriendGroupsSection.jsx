"use client";

import { useEffect, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import {
  desktopColumns,
  mobileColumns,
} from "next-common/components/data/recovery/table/columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";
import useInheritorFriendGroups from "./hooks/useInheritorFriendGroups";

export default function InheritorFriendGroupsSection({ address }) {
  const { data, loading: isLoading } = useInheritorFriendGroups(address);
  const [navCollapsed] = useNavCollapsed();
  const [dataList, setDataList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const total = data?.length || 0;

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
    setDataList(data?.slice(startIndex, endIndex));
    setLoading(false);
  }, [data, isLoading, page, total]);

  return (
    <div>
      <div className="pl-6">
        <span className="font-bold text-[16px] leading-6 text-textPrimary">
          In Friend Groups
        </span>
      </div>
      <div className="mt-4">
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
    </div>
  );
}
