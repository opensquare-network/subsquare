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
import getCycleBlockTimeSummaryItem from "../summary/blockTime";
import getCycleRemainSummaryItem from "../summary/remain";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

export default function FellowshipSalaryCycleDetailInfoOngoing({ cycle = {} }) {
  const { decimals, symbol } = useSalaryAsset();
  const [navCollapsed] = useNavCollapsed();

  const {
    registeredCount,
    unRegisteredPaidCount,
    registrationPeriod,
    payoutPeriod,
    startIndexer,
  } = cycle;

  const { budget, totalRegistrations, totalUnregisteredPaid, cycleStart } =
    cycle.status;

  const totalCyclePeriod = registrationPeriod + payoutPeriod || null;
  const cycleStartAt = cycleStart || null;
  const payoutStartAt = cycleStartAt + registrationPeriod || null;

  const cyclePeriodData = useCalcPeriodBlocks(totalCyclePeriod, cycleStartAt);
  const [totalPeriodDay] = chunk(cyclePeriodData.totalPeriodTime.split(" "), 2);

  const registrationPeriodData = useCalcPeriodBlocks(
    registrationPeriod,
    cycleStartAt,
  );
  const payoutPeriodData = useCalcPeriodBlocks(payoutPeriod, payoutStartAt);

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
    cyclePeriodData.gonePercentage,
    cyclePeriodData.remainBlocks,
  );

  const startTimeItem = getCycleBlockTimeSummaryItem(
    "Start Time",
    startIndexer?.blockTime,
    startIndexer?.blockHeight,
  );

  const timeItem = getCycleRemainSummaryItem(
    registrationPeriodData.gonePercentage,
    registrationPeriodData.remainBlocks,
    registrationPeriodData.totalPeriodTime.split(" "),
    payoutPeriodData.gonePercentage,
    payoutPeriodData.remainBlocks,
    payoutPeriodData.totalPeriodTime.split(" "),
  );

  const desktopSummaryItems = [
    budgetItem,
    totalRegistrationsItem,
    totalUnregisteredPaidItem,
    totalPeriodItem,
    startTimeItem,
    {},
    {},
    timeItem,
  ];

  const mobileSummaryItems = [
    budgetItem,
    totalRegistrationsItem,
    totalUnregisteredPaidItem,
    startTimeItem,
    totalPeriodItem,
    timeItem,
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

      <SummaryItems
        items={desktopSummaryItems}
        className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
      />
      <SummaryItems
        items={mobileSummaryItems}
        className={cn(navCollapsed ? "sm:hidden" : "md:hidden")}
      />
    </PrimaryCard>
  );
}
