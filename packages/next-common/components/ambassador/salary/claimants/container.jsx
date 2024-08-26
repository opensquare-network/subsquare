import AmbassadorSalaryCurrentCycle from "../cycles/current";
import FellowshipSalaryClaimantsList from "next-common/components/fellowship/salary/claimants/list";
import { usePageProps } from "next-common/context/page";
import { useFellowshipSalaryClaimants } from "../../../../hooks/fellowship/salary/useFellowshipSalaryClaimants";

export default function AmbassadorSalaryClaimantsContainer() {
  const { claimants } = useFellowshipSalaryClaimants();
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
