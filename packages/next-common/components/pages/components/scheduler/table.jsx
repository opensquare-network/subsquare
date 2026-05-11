import { MapDataList } from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useSchedulerAgendasWithScanHeight } from "next-common/hooks/useSchedulerAgendas";
import { useColumnsDef } from "./columns";
import { ExecutionTimeProvider } from "./context";
import { usePageProps } from "next-common/context/page";
import ScheduledTreasurySpendPrompt from "./scheduledTreasurySpendPrompt";

export default function SchedulerTable() {
  return (
    <ExecutionTimeProvider>
      <SchedulerTableContent />
    </ExecutionTimeProvider>
  );
}

function SchedulerTableContent() {
  const { scanHeight } = usePageProps();
  const {
    data,
    filteredData = [],
    loading,
  } = useSchedulerAgendasWithScanHeight(scanHeight);
  const columnsDef = useColumnsDef();

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-4">
        <ScheduledTreasurySpendPrompt agendas={data} agendasLoading={loading} />
        <MapDataList
          data={filteredData}
          columnsDef={columnsDef}
          noDataText="No data"
          loading={loading}
        />
      </div>
    </SecondaryCard>
  );
}
