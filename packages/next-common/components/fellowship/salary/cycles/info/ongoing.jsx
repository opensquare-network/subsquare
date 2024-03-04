import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import { ActiveTag } from "next-common/components/tags/state/styled";
import getCycleBudgetSummaryItem from "../summary/budget";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import getCycleRegistrationSummaryItem from "../summary/registration";
import getCycleUnregisteredPaidSummaryItem from "../summary/unregisteredPaid";
import getCycleTotalPeriodSummaryItem from "../summary/totalPeriod";
import chunk from "lodash.chunk";
import { useCalcPeriodBlocks } from "next-common/hooks/useCalcPeriodBlocks";

export default function FellowshipSalaryCycleDetailInfoOngoing({ cycle = {} }) {
  const { decimals, symbol } = useSalaryAsset();

  const {
    registeredCount,
    unRegisteredPaidCount,
    registrationPeriod,
    payoutPeriod,
  } = cycle;

  const { budget, totalRegistrations, totalUnregisteredPaid, cycleStart } =
    cycle.status;

  const totalCyclePeriod = registrationPeriod + payoutPeriod || null;
  const cycleStartAt = cycleStart || null;

  const periodData = useCalcPeriodBlocks(totalCyclePeriod, cycleStartAt);
  const [totalPeriodDay] = chunk(periodData.totalPeriodTime.split(" "), 2);

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

  const totalPeriodItem = getCycleTotalPeriodSummaryItem(
    totalCyclePeriod,
    totalPeriodDay,
    periodData.gonePercentage,
    periodData.remainBlocks,
  );

  const summaryItems = [
    budgetItem,
    totalRegistrationsItem,
    totalUnregisteredPaidItem,
    totalPeriodItem,
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
          <ActiveTag>Ongoing</ActiveTag>
        </div>
      </div>

      <hr className="my-4" />

      <SummaryItems items={summaryItems} />
    </PrimaryCard>
  );
}
