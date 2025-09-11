import { usePageProps } from "next-common/context/page";
import FellowshipSalaryCycleDetailInfoClosed from "./closed";
import FellowshipSalaryCycleDetailInfoOngoing from "./ongoing";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { useMemo } from "react";
import FellowshipSalaryCycleDetailInfoOngoingFooter from "./ongoingFooter";

export default function FellowshipSalaryCycleDetailInfo() {
  const { cycle } = usePageProps();
  const stats = useFellowshipSalaryStats();

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
      footer={<FellowshipSalaryCycleDetailInfoOngoingFooter />}
    />
  ) : (
    <FellowshipSalaryCycleDetailInfoClosed cycle={cycle} />
  );
}
