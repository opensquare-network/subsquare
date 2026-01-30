import SummaryItem from "next-common/components/summary/layout/item";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { isNil } from "lodash-es";
import Link from "next-common/components/link";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";
import SalaryCycleStatus from "./status";
import Loading from "next-common/components/loading";

function CurrentSalaryCycle({ cycleIndex }) {
  return (
    <div className="text12Medium text-textTertiary space-x-1">
      <FellowshipSalaryStatsDetailLink
        index={cycleIndex}
        className="text12Medium text-textTertiary hover:underline"
      >
        Current Salary Cycle
      </FellowshipSalaryStatsDetailLink>
      <span>·</span>
      <span>#{cycleIndex}</span>
    </div>
  );
}

export function FellowshipCurrentSalaryCycleLoading() {
  return (
    <SummaryItem
      title={
        <div className="text12Medium text-textTertiary space-x-1">
          <span className="text12Medium text-textTertiary">
            Current Salary Cycle
          </span>
        </div>
      }
    >
      <div className="flex items-center w-[24px] h-[24px]">
        <Loading size={18} />
      </div>
    </SummaryItem>
  );
}

export function FellowshipCurrentSalaryCycle({ cycleIndex, children }) {
  return (
    <SummaryItem title={<CurrentSalaryCycle cycleIndex={cycleIndex} />}>
      <div className="flex flex-col gap-1">
        <SalaryCycleStatus />
        {children}
      </div>
    </SummaryItem>
  );
}

export default function FellowshipCurrentSalaryCycleSummary() {
  const fellowshipSalaryStats = useFellowshipSalaryStats();

  if (
    isNil(fellowshipSalaryStats) ||
    isNil(fellowshipSalaryStats?.cycleIndex)
  ) {
    return null;
  }

  const { cycleIndex } = fellowshipSalaryStats;

  return (
    <FellowshipCurrentSalaryCycle cycleIndex={cycleIndex}>
      <div className="flex space-x-2">
        <FellowshipSalaryStatsDetailLink
          index={cycleIndex}
          className="text12Medium"
        >
          View Detail
        </FellowshipSalaryStatsDetailLink>
        <Link href="/fellowship/salary" className="text12Medium text-theme500">
          All Cycles
        </Link>
      </div>
    </FellowshipCurrentSalaryCycle>
  );
}
