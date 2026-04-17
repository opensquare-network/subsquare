import { usePageProps } from "next-common/context/page";
import FellowshipSalaryCycleDetailInfoClosed from "next-common/components/fellowship/salary/cycles/info/closed";
import FellowshipSalaryCycleDetailInfoOngoing from "next-common/components/fellowship/salary/cycles/info/ongoing";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { useMemo } from "react";
import SecretarySalaryCycleDetailInfoOngoingFooter from "./ongoingFooter";

export default function SecretarySalaryCycleDetailInfo() {
  const { cycle } = usePageProps();
  const stats = useFellowshipSalaryStats();

  const isActive = useMemo(() => {
    if (cycle.isFinal) {
      return false;
    }
    if (!stats) {
      return true;
    }
    return stats.cycleIndex === cycle.index;
  }, [cycle, stats]);

  return isActive ? (
    <FellowshipSalaryCycleDetailInfoOngoing
      cycle={cycle}
      footer={<SecretarySalaryCycleDetailInfoOngoingFooter />}
    />
  ) : (
    <FellowshipSalaryCycleDetailInfoClosed cycle={cycle} />
  );
}
