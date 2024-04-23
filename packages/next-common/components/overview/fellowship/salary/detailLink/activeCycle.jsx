import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import { isNil } from "lodash-es";
import FellowshipSalaryStatsDetailLink from ".";

export default function FellowshipSalaryStatsActiveCycleDetailLink() {
  const stats = useSelector(fellowshipSalaryStatusSelector);
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
