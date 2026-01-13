import { isNil } from "lodash-es";
import { cn } from "next-common/utils";
import { usePageProps } from "next-common/context/page";
import { MapDataList } from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import { useNavCollapsed } from "next-common/context/nav";
import { useTreasuryBurnTableColumns } from "./columns";

export default function TreasuryBurnTable() {
  const { burnList } = usePageProps();
  const [navCollapsed] = useNavCollapsed();
  const columns = useTreasuryBurnTableColumns();

  const loading = isNil(burnList) || isNil(burnList.items);
  const rowsData = burnList?.items || [];
  const total = burnList?.total || 0;

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
        page={burnList?.page}
        pageSize={burnList?.pageSize}
        total={total}
      />
    </div>
  );
}
