import { MapDataList } from "next-common/components/dataList";

export default function ProjectItemsList({
  items = [],
  loading = false,
  columnsDef,
  noDataText,
}) {
  return (
    <MapDataList
      noDataText={noDataText}
      loading={loading}
      data={items}
      columnsDef={columnsDef}
    />
  );
}

