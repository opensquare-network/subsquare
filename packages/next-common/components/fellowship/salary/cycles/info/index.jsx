import { usePageProps } from "next-common/context/page";
import FellowshipSalaryCycleDetailInfoClosed from "./closed";
import FellowshipSalaryCycleDetailInfoOngoing from "./ongoing";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import { useMemo } from "react";

export default function FellowshipSalaryCycleDetailInfo() {
  const { cycle } = usePageProps();
  const stats = useSelector(fellowshipSalaryStatusSelector);

  const isActive = useMemo(() => {
    if (cycle.isFinal) {
      return false;
    }
    return stats && stats.cycleIndex === cycle.index;
  }, [cycle, stats]);

  return isActive ? (
    <FellowshipSalaryCycleDetailInfoOngoing cycle={cycle} />
  ) : (
    <FellowshipSalaryCycleDetailInfoClosed cycle={cycle} />
  );
}
