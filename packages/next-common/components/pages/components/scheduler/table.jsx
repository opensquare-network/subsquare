import { MapDataList } from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useSchedulerAgendasWithScanHeight } from "next-common/hooks/useSchedulerAgendas";
import { useColumnsDef } from "./columns";
import { ExecutionTimeProvider } from "./context";
import { usePageProps } from "next-common/context/page";

export default function SchedulerTable() {
  const { scanHeight } = usePageProps();
  const { filteredData = [], loading } =
    useSchedulerAgendasWithScanHeight(scanHeight);

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
