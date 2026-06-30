"use client";

import { useEffect, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";
import useHelpOthersAttempts from "./hooks/useHelpOthersAttempts";
import useHelpOthersAttemptsColumns from "./hooks/useHelpOthersAttemptsColumns";

function enhanceAttemptWithFriendGroup(attempt, friendGroups = []) {
  const fgList = friendGroups?.find((fg) => fg.account === attempt.lostAccount);
  const fgGroup = fgList?.friendGroups?.[attempt.friendGroupIndex];
  return { ...attempt, fgGroup };
}

export default function HelpOthersAttemptsSection({ address }) {
  const {
    data: rawData,
    loading: isLoading,
    friendGroupsData,
    fetch,
  } = useHelpOthersAttempts(address);
  const { desktopColumns, mobileColumns } = useHelpOthersAttemptsColumns(
    address,
    fetch,
  );
  const [navCollapsed] = useNavCollapsed();
  const [dataList, setDataList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const total = rawData?.length || 0;

  useEffect(() => {
    setLoading(true);
  }, [page]);

  useEffect(() => {
    if (isLoading || isNil(rawData)) {
      return;
    }

    const enhanced = rawData.map((attempt) =>
      enhanceAttemptWithFriendGroup(attempt, friendGroupsData),
    );

    setTotalCount(total);
    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(enhanced?.slice(startIndex, endIndex));
    setLoading(false);
  }, [rawData, isLoading, page, total, friendGroupsData]);

  return (
    <div>
      <div className="pl-6">
        <span className="font-bold text-[16px] leading-6 text-textPrimary">
          Ongoing Recovery Attempts
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
