import DataList from "next-common/components/dataList";

export default function DelegationList({ isLoading, delegations, columnsDef }) {
  const columns = columnsDef.map(([def]) => def);
  const rows = (delegations || []).map((item) => {
    const row = columnsDef.map(([, render]) => render(item));
    row.key = item.trackId;
    return row;
  });

  return (
    <DataList
      loading={isLoading}
      columns={columns}
      rows={rows}
      noDataText="No current delegations"
    />
  );
}
