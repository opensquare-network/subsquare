import TreeMapDataList from "next-common/components/dataList/treeList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { desktopColumns, mobileColumns } from "../columns";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

export default function OnchainIdentitiesTable({ identityList, isLoading }) {
  const [navCollapsed] = useNavCollapsed();
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(total, defaultPageSize);

  const currentPageData = useMemo(() => {
    if (!identityList) {
      return [];
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;

    return identityList.slice(startIndex, endIndex);
  }, [identityList, page]);

  useEffect(() => {
    setTotal(identityList?.length || 0);
  }, [identityList]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <SecondaryCard className="space-y-2">
        <TreeMapDataList
          className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
          columnsDef={desktopColumns}
          data={currentPageData}
          loading={isLoading}
          noDataText="No identities"
          treeKey="subIdentities"
        />

        <TreeMapDataList
          className={cn(
            "hidden",
            navCollapsed ? "max-sm:block" : "max-md:block",
          )}
          columnsDef={mobileColumns}
          data={currentPageData}
          loading={isLoading}
          noDataText="No identities"
          treeKey="subIdentities"
        />
        {total > 0 && pageComponent}
      </SecondaryCard>
    </div>
  );
}
