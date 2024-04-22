import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import { ClosedTag } from "next-common/components/tags/state/styled";
import FellowshipCycleProgress from "./progress";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SalaryStatsIndexItem from "../summary/indexItem";
import SalaryStatsBudgetItem from "../summary/budgetItem";
import SalaryStatsRegistrationItem from "../summary/registrationItem";
import SalaryStatsUnregisteredItem from "../summary/unregisteredItem";
import SalaryStatsBlockTimeItem from "../summary/blockTimeItem";
import SalaryStatsTotalDurationSummaryItem from "../summary/totalDurationItem";

export default function FellowshipSalaryCycleDetailInfoClosed({ cycle = {} }) {
  const { startIndexer, endIndexer } = cycle;

  const { budget } = cycle.status;

  return (
    <PrimaryCard>
      <div className="flex justify-between gap-x-4">
        <SummaryLayout>
          <SalaryStatsIndexItem index={cycle.index} />
        </SummaryLayout>

        <div className="flex items-start">
          <ClosedTag>Closed</ClosedTag>
        </div>
      </div>

      <hr className="my-4" />

      <SummaryLayout>
        <SalaryStatsBudgetItem budget={budget} />
        <SalaryStatsRegistrationItem cycleData={cycle} />
        <SalaryStatsUnregisteredItem cycleData={cycle} />
        <SalaryStatsTotalDurationSummaryItem cycleData={cycle} />
        <SalaryStatsBlockTimeItem
          title="Start Time"
          blockHeight={startIndexer?.blockHeight}
          blockTime={startIndexer?.blockTime}
        />
        {endIndexer && (
          <SalaryStatsBlockTimeItem
            title="End Time"
            blockHeight={endIndexer?.blockHeight}
            blockTime={endIndexer?.blockTime}
          />
        )}
      </SummaryLayout>

      <div className="mt-4">
        <FellowshipCycleProgress cycle={cycle} />
      </div>
    </PrimaryCard>
  );
}
