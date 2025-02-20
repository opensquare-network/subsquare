import TreeMapDataList from "next-common/components/dataList/treeList";
import { desktopColumns, mobileColumns } from "./columns";
import { useAllProxiesContext } from "next-common/components/data/context/allProxies";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import useFilterAllProxies from "next-common/components/data/proxies/hooks/useFilterAllProxies";
import { useRouter } from "next/router";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import TableHeader from "next-common/components/data/common/tableHeader";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";

export default function ProxyExplorerTable() {
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const [navCollapsed] = useNavCollapsed();
  const { data, loading } = useAllProxiesContext();
  const { filteredProxies, total, isLoading } = useFilterAllProxies(
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
    setDataList(filteredProxies?.slice(startIndex, endIndex));
  }, [filteredProxies, page, isLoading]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <DropdownUrlFilterProvider defaultFilterValues={{ my_related: null }}>
        <TableHeader total={total} loading={isLoading} />
        <SecondaryCard className="space-y-2">
          <TreeMapDataList
            className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
            columnsDef={desktopColumns}
            data={dataList}
            loading={isLoading}
            treeKey="items"
          />

          <TreeMapDataList
            className={cn(
              "hidden",
              navCollapsed ? "max-sm:block" : "max-md:block",
            )}
            columnsDef={mobileColumns}
            data={dataList}
            loading={isLoading}
            treeKey="items"
          />
          {total > 0 && pageComponent}
        </SecondaryCard>
      </DropdownUrlFilterProvider>
    </div>
  );
}
