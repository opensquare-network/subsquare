import TreeMapDataList from "next-common/components/dataList/treeList";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { desktopColumns, mobileColumns } from "./columns";
import { useAllProxiesContext } from "next-common/components/data/context/allProxies";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import useFilterAllProxies from "next-common/components/data/hooks/useFilterAllProxies";
import useMyRelatedSwitch from "next-common/components/data/hooks/useMyRelatedSwitch";
import { useRouter } from "next/router";

function TableHeader({ total, loading }) {
  const { component: MyRelatedSwitchComponent } = useMyRelatedSwitch();

  return (
    <div>
      <TitleContainer>
        <span>
          List
          <span className="text-textTertiary text14Medium ml-1">
            {!loading && total}
          </span>
        </span>
        {MyRelatedSwitchComponent}
      </TitleContainer>
      {/* TODO: filter by identity name or address */}
    </div>
  );
}

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
      <TableHeader total={total} loading={isLoading} />
      <TreeMapDataList
        className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
        bordered
        columnsDef={desktopColumns}
        noDataText="No Data"
        data={dataList}
        loading={isLoading}
        treeKey="items"
        tree={true}
        page={page}
        pageSize={defaultPageSize}
      />

      <TreeMapDataList
        className={cn("hidden", navCollapsed ? "max-sm:block" : "max-md:block")}
        bordered
        columnsDef={mobileColumns}
        noDataText="No Data"
        data={dataList}
        loading={isLoading}
        treeKey="items"
        tree={true}
        page={page}
        pageSize={defaultPageSize}
      />
      {total > 0 && pageComponent}
    </div>
  );
}
