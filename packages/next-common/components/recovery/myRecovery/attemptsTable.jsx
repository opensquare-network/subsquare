"use client";

import { isNil } from "lodash-es";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import useRecoveryAttemptsTableColumns from "./hooks/useRecoveryAttemptsTableColumns";

function enhanceAttemptWithFriendGroup(attempt, friendGroups = []) {
  const fgList = friendGroups?.find((fg) => fg.account === attempt.lostAccount);
  const fgGroup = fgList?.friendGroups?.[attempt.friendGroupIndex];
  return { ...attempt, fgGroup };
}

export default function MyRecoveryAttemptsTable({
  data,
  loading: isLoading,
  friendGroups,
  onSlash = () => {},
  onCancel = () => {},
}) {
  const [navCollapsed] = useNavCollapsed();
  const [dataList, setDataList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { desktopColumns, mobileColumns } = useRecoveryAttemptsTableColumns(
    onSlash,
    onCancel,
  );

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

    const enhanced = (data || []).map((attempt) =>
      enhanceAttemptWithFriendGroup(attempt, friendGroups),
    );

    setTotalCount(total);
    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(enhanced?.slice(startIndex, endIndex));
    setLoading(false);
  }, [data, isLoading, page, total, friendGroups]);

  return (
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
  );
}
