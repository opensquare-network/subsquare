import { isNil } from "lodash-es";
import AmbassadorSalaryStatsDetailLink from ".";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";

export default function AmbassadorSalaryStatsActiveCycleDetailLink() {
  const stats = useFellowshipSalaryStats();
  if (isNil(stats?.cycleIndex)) {
    return null;
  }

  return (
    <AmbassadorSalaryStatsDetailLink
      index={stats?.cycleIndex}
      className="text14Medium"
    >
      View Detail
    </AmbassadorSalaryStatsDetailLink>
  );
}
