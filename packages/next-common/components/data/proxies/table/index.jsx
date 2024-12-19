import { TreeMapDataList } from "next-common/components/dataList";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { desktopColumns, mobileColumns } from "./columns";
import { useAllProxiesContext } from "next-common/components/data/context/allProxies";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

function TableHeader() {
  const { total, loading } = useAllProxiesContext();

  return (
    <div>
      <TitleContainer>
        <span>
          List
          <span className="text-textTertiary text14Medium ml-1">
            {!loading && total}
          </span>
        </span>
        {/* TODO: filter by current address */}
      </TitleContainer>
      {/* TODO: filter by identity name or address */}
    </div>
  );
}

export default function ProxyExplorerTable() {
  const [dataList, setDataList] = useState([]);

  const [navCollapsed] = useNavCollapsed();
  const { data, total, loading } = useAllProxiesContext();

  const { page, component: pageComponent } = usePaginationComponent(
    total,
    defaultPageSize,
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(data?.slice(startIndex, endIndex));
  }, [data, page, loading]);

  return (
    <div className="flex flex-col gap-y-4">
      <TableHeader />
      <TreeMapDataList
        className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
        bordered
        columnsDef={desktopColumns}
        noDataText="No Data"
        data={dataList}
        loading={loading}
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
        loading={loading}
        treeKey="items"
        tree={true}
        page={page}
        pageSize={defaultPageSize}
      />
      {total > 0 && pageComponent}
    </div>
  );
}
