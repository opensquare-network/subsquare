import { useAmbassadorSalaryClaimantsData } from "next-common/hooks/ambassador/summary/useAmbassadorSalaryClaimantsData";
import AmbassadorSalaryCurrentCycle from "../cycles/current";
import FellowshipSalaryClaimantsList from "next-common/components/fellowship/salary/claimants/list";
import { usePageProps } from "next-common/context/page";

export default function AmbassadorSalaryClaimantsContainer() {
  const claimants = useAmbassadorSalaryClaimantsData();
  const { ambassadorParams, ambassadorMembers } = usePageProps();

  return (
    <div className="space-y-6">
      <AmbassadorSalaryCurrentCycle />
      <FellowshipSalaryClaimantsList
        claimants={claimants}
        params={ambassadorParams}
        members={ambassadorMembers}
      />
    </div>
  );
}
