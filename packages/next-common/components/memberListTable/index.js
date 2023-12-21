import StyledList from "../styledList";

export default function MemberListTable({
  columns = [],
  rows = [],
  loading = false,
  noDataText = "No current members",
  ...restProps
}) {
  return (
    <StyledList
      columns={columns}
      rows={rows}
      loading={loading}
      noDataText={noDataText}
      {...restProps}
    />
  );
}
