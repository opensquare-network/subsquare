import { MapDataList } from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useSchedulerAgendas from "next-common/hooks/useSchedulerAgendas";
import columnsDef from "./columns";

export default function SchedulerTable() {
  const { data = [], loading } = useSchedulerAgendas();

  return (
    <SecondaryCard>
      <MapDataList
        data={data}
        columnsDef={columnsDef}
        noDataText="No scheduled calls"
        loading={loading}
      />
    </SecondaryCard>
  );
}
