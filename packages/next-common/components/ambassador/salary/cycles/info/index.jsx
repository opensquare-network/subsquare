import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";
import FellowshipSalaryCycleDetailInfoClosed from "next-common/components/fellowship/salary/cycles/info/closed";
import FellowshipSalaryCycleDetailInfoOngoing from "next-common/components/fellowship/salary/cycles/info/ongoing";
import AmbassadorSalaryCycleDetailInfoOngoingFooter from "./ongoingFooter";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";

export default function AmbassadorSalaryCycleDetailInfo() {
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
      footer={<AmbassadorSalaryCycleDetailInfoOngoingFooter />}
    />
  ) : (
    <FellowshipSalaryCycleDetailInfoClosed cycle={cycle} />
  );
}
