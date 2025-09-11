import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import { ActiveTag } from "next-common/components/tags/state/styled";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import FellowshipCycleProgress from "./progress";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SalaryStatsIndexItem from "../summary/indexItem";
import SalaryStatsBudgetItem from "../summary/budgetItem";
import SalaryStatsRegistrationItem from "../summary/registrationItem";
import SalaryStatsUnregisteredItem from "../summary/unregisteredItem";
import SalaryStatsTotalPeriodItem from "../summary/totalPeriodItem";
import SalaryStatsBlockTimeItem from "../summary/blockTimeItem";
import { DesktopPlaceHolderItem } from "next-common/components/overview/fellowship/salary/stats";
import SalaryStatsTimeRemainItem from "../summary/timeRemainItem";

export default function FellowshipSalaryCycleDetailInfoOngoing({
  cycle = {},
  footer,
}) {
  const [navCollapsed] = useNavCollapsed();

  const { startIndexer } = cycle;

  const { budget, cycleStart } = cycle.status;

  return (
    <PrimaryCard>
      <div className="flex justify-between gap-x-4">
        <SummaryLayout>
          <SalaryStatsIndexItem index={cycle.index} />
        </SummaryLayout>

        <div className="flex items-start">
          <ActiveTag>Ongoing</ActiveTag>
        </div>
      </div>

      <hr className="my-4" />

      <SummaryLayout
        className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
      >
        <SalaryStatsBudgetItem budget={budget} />
        <SalaryStatsRegistrationItem cycleData={cycle} />
        <SalaryStatsUnregisteredItem cycleData={cycle} />
        <SalaryStatsTotalPeriodItem cycleStart={cycleStart} />
        <SalaryStatsBlockTimeItem
          title="Start Time"
          blockHeight={startIndexer?.blockHeight}
          blockTime={startIndexer?.blockTime}
        />
        <DesktopPlaceHolderItem />
        <DesktopPlaceHolderItem />
        <SalaryStatsTimeRemainItem />
      </SummaryLayout>

      <SummaryLayout className={cn(navCollapsed ? "sm:hidden" : "md:hidden")}>
        <SalaryStatsBudgetItem budget={budget} />
        <SalaryStatsRegistrationItem cycleData={cycle} />
        <SalaryStatsUnregisteredItem cycleData={cycle} />
        <SalaryStatsBlockTimeItem
          title="Start Time"
          blockHeight={startIndexer?.blockHeight}
          blockTime={startIndexer?.blockTime}
        />
        <SalaryStatsTotalPeriodItem cycleStart={cycleStart} />
        <SalaryStatsTimeRemainItem />
      </SummaryLayout>

      <div className="mt-4">
        <FellowshipCycleProgress cycle={cycle} />
      </div>

      {footer && (
        <>
          <hr className="my-4" />

          {footer}
        </>
      )}
    </PrimaryCard>
  );
}
