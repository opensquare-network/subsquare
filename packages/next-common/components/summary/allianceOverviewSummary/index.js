import { usePageProps } from "next-common/context/page";
import ActiveValue from "../overviewSummary/activeValue";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import {
  FellowshipCurrentSalaryCycle,
  FellowshipCurrentSalaryCycleLoading,
} from "next-common/components/overview/fellowship/finance/currentSalaryCycle";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { isNil } from "lodash-es";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";

function FellowshipCurrentSalaryCycleSummary() {
  const fellowshipSalaryStats = useFellowshipSalaryStats();

  if (
    isNil(fellowshipSalaryStats) ||
    isNil(fellowshipSalaryStats?.cycleIndex)
  ) {
    return <FellowshipCurrentSalaryCycleLoading />;
  }

  const { cycleIndex } = fellowshipSalaryStats;

  return <FellowshipCurrentSalaryCycle cycleIndex={cycleIndex} />;
}

export default function AllianceOverviewSummary() {
  const { summary } = usePageProps();

  const { fellowshipReferenda, fellowshipApplications } = summary ?? {};

  return (
    <SummaryLayout>
      <SummaryItem title="Fellowship Referenda">
        <ActiveValue
          href={"/fellowship"}
          tooltip="Active fellowship referenda"
          value={fellowshipReferenda?.active || 0}
        />
      </SummaryItem>
      <SummaryItem title="Fellowship Applications">
        <ActiveValue
          href={"/fellowship/applications"}
          tooltip="Active fellowship applications"
          value={fellowshipApplications?.active || 0}
        />
      </SummaryItem>
      <CollectivesProvider>
        <FellowshipCurrentSalaryCycleSummary />
      </CollectivesProvider>
    </SummaryLayout>
  );
}
