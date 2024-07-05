import { usePageProps } from "next-common/context/page";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import FellowshipSalaryCycleDetailInfoClosed from "next-common/components/fellowship/salary/cycles/info/closed";
import FellowshipSalaryCycleDetailInfoOngoing from "next-common/components/fellowship/salary/cycles/info/ongoing";
import AmbassadorSalaryCycleDetailInfoOngoingFooter from "./ongoingFooter";

export default function AmbassadorSalaryCycleDetailInfo() {
  const { cycle } = usePageProps();
  const stats = useSelector(ambassadorSalaryStatusSelector);

  const isActive = useMemo(() => {
    if (cycle.isFinal) {
      return false;
    }

    if (!stats) {
      return !cycle.isFinal;
    }

    return stats.cycleIndex === cycle.index;
  }, [cycle, stats]);

  return isActive ? (
    <FellowshipSalaryCycleDetailInfoOngoing
      cycle={cycle}
      footer={<AmbassadorSalaryCycleDetailInfoOngoingFooter />}
    />
  ) : (
    <FellowshipSalaryCycleDetailInfoClosed cycle={cycle} />
  );
}
