import SummaryItem from "next-common/components/summary/layout/item";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { isNil } from "lodash-es";
import Link from "next-common/components/link";
import FellowshipSalaryStatsDetailLink from "next-common/components/overview/fellowship/salary/detailLink";
import SalaryCycleStatus from "./status";
import Loading from "next-common/components/loading";
import { useCollectivesSection } from "next-common/context/collectives/collectives";

function CurrentSalaryCycle({ title = "Current Salary Cycle", cycleIndex }) {
  return (
    <div className="text12Medium text-textTertiary space-x-1">
      <FellowshipSalaryStatsDetailLink
        index={cycleIndex}
        className="text12Medium text-textTertiary hover:underline"
      >
        {title}
      </FellowshipSalaryStatsDetailLink>
      <span>·</span>
      <span>#{cycleIndex}</span>
    </div>
  );
}

export function FellowshipCurrentSalaryCycleLoading({
  title = "Current Salary Cycle",
}) {
  return (
    <SummaryItem
      title={
        <div className="text12Medium text-textTertiary space-x-1">
          <span className="text12Medium text-textTertiary">{title}</span>
        </div>
      }
    >
      <div className="flex items-center w-[24px] h-[24px]">
        <Loading size={18} />
      </div>
    </SummaryItem>
  );
}

export function FellowshipCurrentSalaryCycle({ title, cycleIndex, children }) {
  return (
    <SummaryItem
      title={<CurrentSalaryCycle title={title} cycleIndex={cycleIndex} />}
    >
      <div className="flex flex-col gap-1">
        <SalaryCycleStatus />
        {children}
      </div>
    </SummaryItem>
  );
}

export default function FellowshipCurrentSalaryCycleSummary({ title }) {
  const section = useCollectivesSection();
  const fellowshipSalaryStats = useFellowshipSalaryStats();

  if (
    isNil(fellowshipSalaryStats) ||
    isNil(fellowshipSalaryStats?.cycleIndex)
  ) {
    return null;
  }

  const { cycleIndex } = fellowshipSalaryStats;

  return (
    <FellowshipCurrentSalaryCycle title={title} cycleIndex={cycleIndex}>
      <div className="flex space-x-2">
        <FellowshipSalaryStatsDetailLink
          index={cycleIndex}
          className="text12Medium"
        >
          View Detail
        </FellowshipSalaryStatsDetailLink>
        <Link
          href={`/${section}/salary`}
          className="text12Medium text-theme500"
        >
          All Cycles
        </Link>
      </div>
    </FellowshipCurrentSalaryCycle>
  );
}
