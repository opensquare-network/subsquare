import { MapDataList } from "next-common/components/dataList";

export default function DelegationList({ isLoading, delegations, columnsDef }) {
  return (
    <MapDataList
      loading={isLoading}
      columnsDef={columnsDef}
      getRowKey={(row) => row.trackId}
      data={delegations}
      noDataText="No current delegations"
    />
  );
}
