import DataList from "../dataList";

export default function MemberListTable({
  columns = [],
  rows = [],
  loading = false,
  noDataText = "No current members",
  ...restProps
}) {
  return (
    <DataList
      bordered
      rows={rows}
      columns={columns}
      loading={loading}
      noDataText={noDataText}
      {...restProps}
    />
  );
}
