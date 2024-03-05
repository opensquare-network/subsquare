import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import { ClosedTag } from "next-common/components/tags/state/styled";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import getCycleBudgetSummaryItem from "../summary/budget";
import getCycleRegistrationSummaryItem from "../summary/registration";
import getCycleUnregisteredPaidSummaryItem from "../summary/unregisteredPaid";
import getCycleBlockTimeSummaryItem from "../summary/blockTime";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";
import chunk from "lodash.chunk";
import getCycleTotalDurationSummaryItem from "../summary/totalDuration";

export default function FellowshipSalaryCycleDetailInfoClosed({ cycle = {} }) {
  const { decimals, symbol } = useSalaryAsset();

  const {
    registeredCount,
    unRegisteredPaidCount,
    registrationPeriod,
    payoutPeriod,
    startIndexer,
    endIndexer,
  } = cycle;

  const { budget, totalRegistrations, totalUnregisteredPaid, cycleStart } =
    cycle.status;

  const totalCyclePeriod = registrationPeriod + payoutPeriod || null;
  const cycleStartAt = cycleStart || null;

  const cyclePeriodData = useCalcPeriodBlocks(totalCyclePeriod, cycleStartAt);
  const [totalPeriodDay] = chunk(cyclePeriodData.totalPeriodTime.split(" "), 2);

  const budgetItem = getCycleBudgetSummaryItem(budget, decimals, symbol);

  const totalRegistrationsItem = getCycleRegistrationSummaryItem(
    totalRegistrations,
    decimals,
    symbol,
    registeredCount,
  );

  const totalUnregisteredPaidItem = getCycleUnregisteredPaidSummaryItem(
    totalUnregisteredPaid,
    decimals,
    symbol,
    unRegisteredPaidCount,
  );

  const totalDurationItem = getCycleTotalDurationSummaryItem(
    totalCyclePeriod,
    totalPeriodDay,
  );

  const startTimeItem = getCycleBlockTimeSummaryItem(
    "Start Time",
    startIndexer.blockTime,
    startIndexer.blockHeight,
  );

  const endTimeItem = getCycleBlockTimeSummaryItem(
    "End Time",
    endIndexer.blockTime,
    endIndexer.blockHeight,
  );

  const items = [
    budgetItem,
    totalRegistrationsItem,
    totalUnregisteredPaidItem,
    totalDurationItem,
    startTimeItem,
    endTimeItem,
  ];

  return (
    <PrimaryCard>
      <div className="flex justify-between gap-x-4">
        <SummaryItems
          items={[
            {
              title: "Cycle",
              content: cycle.index,
            },
          ]}
        />
        <div className="flex items-start">
          <ClosedTag>Closed</ClosedTag>
        </div>
      </div>

      <hr className="my-4" />

      <SummaryItems items={items} />
    </PrimaryCard>
  );
}
