import { MapDataList } from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useSchedulerAgendas from "next-common/hooks/useSchedulerAgendas";
import { useColumnsDef } from "./columns";
import { ExecutionTimeProvider } from "./context";

export default function SchedulerTable() {
  const { filteredData = [], loading } = useSchedulerAgendas();

  return (
    <ExecutionTimeProvider>
      <SchedulerTableContent data={filteredData} loading={loading} />
    </ExecutionTimeProvider>
  );
}

function SchedulerTableContent({ data = [], loading = false }) {
  const columnsDef = useColumnsDef();
  return (
    <SecondaryCard>
      <MapDataList
        data={data}
        columnsDef={columnsDef}
        noDataText="No data"
        loading={loading}
      />
    </SecondaryCard>
  );
}
