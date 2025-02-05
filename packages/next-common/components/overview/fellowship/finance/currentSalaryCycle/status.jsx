import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { isNil } from "lodash-es";
import CountDown from "next-common/components/_CountDown";
import Remaining from "next-common/components/remaining";
import useFellowshipSalaryCycleData from "./useFellowshipSalaryCycleData";

function SalaryCycleCountdown({ percentage, remain }) {
  return (
    <CountDown
      numerator={percentage}
      denominator={100}
      tooltipContent={<Remaining blocks={remain} percentage={percentage} />}
      backgroundColor="var(--theme100)"
      foregroundColor="var(--theme500)"
    />
  );
}

export default function SalaryCycleStatus() {
  const fellowshipSalaryStats = useFellowshipSalaryStats();
  const { gonePercentage, remainBlocks } =
    useFellowshipSalaryCycleData(fellowshipSalaryStats) || {};

  if (isNil(gonePercentage) || isNil(remainBlocks)) {
    return null;
  }

  return (
    <div className="inline-flex space-x-2 items-center">
      <div className="text16Bold text-textPrimary">Registration</div>
      <SalaryCycleCountdown percentage={gonePercentage} remain={remainBlocks} />
    </div>
  );
}
