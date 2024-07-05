import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import AmbassadorSalaryStatsDetailLink from ".";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";

export default function AmbassadorSalaryStatsActiveCycleDetailLink() {
  const stats = useSelector(ambassadorSalaryStatusSelector);
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
