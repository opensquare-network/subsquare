import DemocracyStatistics from "next-common/components/statistics/democracy";
import { usePageProps } from "next-common/context/page";

export default function DemocracyStats() {
  const { delegatee, delegators, democracySummary } = usePageProps();
  return (
    <DemocracyStatistics
      delegatee={delegatee}
      delegators={delegators}
      summary={democracySummary}
    />
  );
}
