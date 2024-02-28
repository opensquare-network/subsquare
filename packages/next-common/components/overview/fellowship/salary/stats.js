import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Summary from "next-common/components/summary/v2/base";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn, toPrecision } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { toPercentage } from "next-common/utils";
import isNil from "lodash.isnil";
import chunk from "lodash.chunk";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import FellowshipTotalPeriodCountdown from "./totalPeriodCountdown";
import { useNavCollapsed } from "next-common/context/nav";
import LoadableContent from "next-common/components/common/loadableContent";
import RemainLabel from "./remainLabel";
import Tooltip from "next-common/components/tooltip";

export default function FellowshipSalaryStats() {
  const [navCollapsed] = useNavCollapsed();
  const stats = useSubFellowshipSalaryStats();
  const { registrationPeriod, payoutPeriod } = useFellowshipSalaryPeriods();
  const { decimals, symbol } = useSalaryAsset();
  const latestHeight = useSelector(chainOrScanHeightSelector);

  const budgetValue = stats?.budget;
  const totalRegistrationsValue = stats?.totalRegistrations;
  const totalUnregisteredPaidValue = stats?.totalUnregisteredPaid;
  let potValue =
    budgetValue - totalUnregisteredPaidValue - totalRegistrationsValue || null;
  potValue = potValue < 0 ? 0 : potValue;

  const totalCyclePeriod = registrationPeriod + payoutPeriod || null;
  const cycleStartAt = stats?.cycleStart || null;
  const cycleEndAt = cycleStartAt + totalCyclePeriod || null;
  const payoutStartAt = cycleStartAt + registrationPeriod || null;

  const isCycleStarted = latestHeight >= cycleStartAt;
  const isRegistrationStarted = latestHeight >= cycleStartAt;
  const isPayoutStarted = latestHeight >= payoutStartAt;

  const registrationTime = useEstimateBlocksTime(registrationPeriod).split(" ");
  const payoutTime = useEstimateBlocksTime(payoutPeriod).split(" ");
  const totalPeriodTime = useEstimateBlocksTime(totalCyclePeriod).split(" ");
  const [totalPeriodDay] = chunk(totalPeriodTime, 2);

  const totalGone = latestHeight - cycleStartAt;
  const totalRemain = Math.max(0, cycleEndAt - latestHeight);
  const totalPercentage = isCycleStarted
    ? Math.min(100, toPercentage(totalGone / totalCyclePeriod, 2))
    : 0;

  const registrationRemain = Math.max(0, registrationPeriod - totalGone);
  const registrationPercentage = isRegistrationStarted
    ? Math.min(
        100,
        toPercentage(1 - registrationRemain / registrationPeriod, 2),
      )
    : 0;

  const payoutRemain = Math.max(
    0,
    isPayoutStarted ? payoutPeriod - (totalGone - registrationPeriod) : 0,
  );
  const payoutPercentage = isPayoutStarted
    ? Math.min(100, toPercentage(1 - payoutRemain / payoutPeriod, 2))
    : 0;

  const desktopPlaceholderVisibleItem = {
    className: cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden"),
  };
  const mobilePlaceholderVisibleItem = {
    className: cn(navCollapsed ? "sm:hidden" : "md:hidden"),
  };

  const cycleIndexItem = {
    title: "Cycle Index",
    content: (
      <LoadableContent isLoading={isNil(stats?.cycleIndex)}>
        {stats?.cycleIndex}
      </LoadableContent>
    ),
  };

  const budgetItem = {
    title: "Budget",
    content: (
      <LoadableContent isLoading={isNil(budgetValue)}>
        <ValueDisplay
          value={toPrecision(budgetValue, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    ),
  };

  const totalRegistrationsItem = {
    title: "Total Registrations",
    content: (
      <LoadableContent isLoading={isNil(totalRegistrationsValue)}>
        <ValueDisplay
          value={toPrecision(totalRegistrationsValue, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    ),
  };

  const totalPeriodItem = {
    title: "Total Period",
    className: "relative",
    content: (
      <LoadableContent isLoading={isNil(totalCyclePeriod)}>
        <Tooltip
          content={<span>{totalCyclePeriod?.toLocaleString?.()} blocks</span>}
        >
          <div>
            {totalPeriodDay[0]}{" "}
            <span className="text-textTertiary">{totalPeriodDay[1]}</span>
          </div>
        </Tooltip>
      </LoadableContent>
    ),
    suffix: (
      <FellowshipTotalPeriodCountdown
        className="absolute top-0 right-0"
        percentage={totalPercentage}
        totalRemain={totalRemain}
      />
    ),
  };

  const totalUnregisteredPaidItem = {
    title: "Total Unregistered Paid",
    content: (
      <LoadableContent isLoading={isNil(totalUnregisteredPaidValue)}>
        <ValueDisplay
          value={toPrecision(totalUnregisteredPaidValue, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    ),
  };

  const potItem = {
    title: "Pot",
    content: (
      <LoadableContent isLoading={isNil(potValue)}>
        <ValueDisplay value={toPrecision(potValue, decimals)} symbol={symbol} />
      </LoadableContent>
    ),
  };

  const timeItem = {
    content: (
      <LoadableContent isLoading={isNil(totalCyclePeriod)}>
        <div className="space-y-1">
          <RemainLabel
            percentage={registrationPercentage}
            label={"Registration"}
            remain={registrationRemain}
            time={registrationTime}
          />
          <RemainLabel
            percentage={payoutPercentage}
            label={"Payout"}
            remain={payoutRemain}
            time={payoutTime}
          />
        </div>
      </LoadableContent>
    ),
  };

  const desktopSummaryItems = [
    cycleIndexItem,
    budgetItem,
    potItem,
    totalPeriodItem,
    desktopPlaceholderVisibleItem,
    totalRegistrationsItem,
    totalUnregisteredPaidItem,
    mobilePlaceholderVisibleItem,
    timeItem,
  ];

  const mobileSummaryItems = [
    cycleIndexItem,
    mobilePlaceholderVisibleItem,
    budgetItem,
    potItem,
    totalRegistrationsItem,
    totalUnregisteredPaidItem,
    totalPeriodItem,
    desktopPlaceholderVisibleItem,
    timeItem,
  ];

  return (
    <div>
      <TitleContainer className="mb-4">Fellowship Salary Stats</TitleContainer>
      <SecondaryCard>
        <Summary
          items={desktopSummaryItems}
          className={desktopPlaceholderVisibleItem.className}
        />
        <Summary
          items={mobileSummaryItems}
          className={mobilePlaceholderVisibleItem.className}
        />
      </SecondaryCard>
    </div>
  );
}
