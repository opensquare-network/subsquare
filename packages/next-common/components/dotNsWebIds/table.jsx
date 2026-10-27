import { useMemo, useState } from "react";
import { MapDataList } from "next-common/components/dataList";
import useSearchComponent from "next-common/components/data/common/useSearchComponent";
import { TableName } from "next-common/components/data/common/tableHeader";
import { useListPagination } from "next-common/components/pagination/usePaginationComponent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { defaultPageSize } from "next-common/utils/constants";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { getDesktopColumns, getMobileColumns } from "./columns";

const LabelStorePopup = dynamicPopup(() => import("./labelStorePopup"));

export default function DotNsWebIdsTable({ dotNsWebIds = [], loading, error }) {
  const { search = "", component: searchComponent } = useSearchComponent({
    placeholder: "Search by name or address",
  });
  const [navCollapsed] = useNavCollapsed();
  const [selectedLabelStore, setSelectedLabelStore] = useState(null);

  const desktopColumns = useMemo(
    () => getDesktopColumns({ onViewLabelStore: setSelectedLabelStore }),
    [],
  );
  const mobileColumns = useMemo(
    () => getMobileColumns({ onViewLabelStore: setSelectedLabelStore }),
    [],
  );

  const filteredDotNsWebIds = useMemo(() => {
    const keyword = (search || "").trim().toLowerCase();
    if (!keyword) {
      return dotNsWebIds;
    }

    return dotNsWebIds.filter((item) =>
      [item.label, item.owner, item.labelStore, item.userStore]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [dotNsWebIds, search]);

  const { pagedItems, component: pagination } = useListPagination(
    filteredDotNsWebIds,
    defaultPageSize,
  );

  const noDataText = error
    ? "Failed to load DotNS Web IDs"
    : "No DotNS Web IDs";

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <TableName
          title="DotNS Web IDs"
          total={filteredDotNsWebIds.length}
          loading={loading}
        />
        {searchComponent}
      </div>
      <SecondaryCard className="space-y-2">
        <MapDataList
          className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
          columnsDef={desktopColumns}
          data={pagedItems}
          loading={loading}
          noDataText={noDataText}
        />
        <MapDataList
          className={cn(
            "hidden",
            navCollapsed ? "max-sm:block" : "max-md:block",
          )}
          columnsDef={mobileColumns}
          data={pagedItems}
          loading={loading}
          noDataText={noDataText}
        />
        {filteredDotNsWebIds.length > 0 && pagination}
      </SecondaryCard>
      {selectedLabelStore && (
        <LabelStorePopup
          labelStore={selectedLabelStore}
          onClose={() => setSelectedLabelStore(null)}
        />
      )}
    </div>
  );
}
