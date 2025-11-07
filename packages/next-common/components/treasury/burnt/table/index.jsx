import { isNil } from "lodash-es";
import { cn } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import { MapDataList } from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import { useNavCollapsed } from "next-common/context/nav";
import columns from "./columns";

export default function TreasuryBurntTable() {
  const { burntList } = usePageProps();
  const [navCollapsed] = useNavCollapsed();

  const loading = isNil(burntList) || isNil(burntList.items);
  const rowsData = burntList?.items || [];
  const total = burntList?.total || 0;

  return (
    <div className="flex flex-col gap-y-4">
      <MapDataList
        className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
        columnsDef={columns}
        data={rowsData}
        loading={loading}
        getRowKey={(row) => row?._id}
      />
      <MapDataList
        className={cn("hidden", navCollapsed ? "max-sm:block" : "max-md:block")}
        columnsDef={columns}
        data={rowsData}
        loading={loading}
        getRowKey={(row) => row?._id}
      />
      <Pagination
        page={burntList?.page}
        pageSize={burntList?.pageSize}
        total={total}
      />
    </div>
  );
}
