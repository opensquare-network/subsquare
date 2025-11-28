import { MapDataList } from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useSchedulerAgendas from "next-common/hooks/useSchedulerAgendas";
import columnsDef from "./columns";

export default function SchedulerTable() {
  const { filteredData = [], loading } = useSchedulerAgendas();

  return (
    <SecondaryCard>
      <MapDataList
        data={filteredData}
        columnsDef={columnsDef}
        noDataText="No scheduled calls"
        loading={loading}
      />
    </SecondaryCard>
  );
}
