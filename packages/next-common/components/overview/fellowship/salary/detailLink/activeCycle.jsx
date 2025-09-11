import { isNil } from "lodash-es";
import FellowshipSalaryStatsDetailLink from ".";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";

export default function FellowshipSalaryStatsActiveCycleDetailLink() {
  const stats = useFellowshipSalaryStats();
  if (isNil(stats?.cycleIndex)) {
    return null;
  }

  return (
    <FellowshipSalaryStatsDetailLink
      index={stats?.cycleIndex}
      className="text14Medium"
    >
      View Detail
    </FellowshipSalaryStatsDetailLink>
  );
}
