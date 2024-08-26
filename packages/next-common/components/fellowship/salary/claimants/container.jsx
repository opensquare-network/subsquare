import { useFellowshipSalaryClaimants } from "next-common/hooks/fellowship/salary/useFellowshipSalaryClaimants";
import FellowshipSalaryActiveCycle from "../cycles/current";
import FellowshipSalaryClaimantsList from "./list";
import { usePageProps } from "next-common/context/page";

export default function FellowshipSalaryClaimantsContainer() {
  const { claimants } = useFellowshipSalaryClaimants();
  const { fellowshipParams, fellowshipMembers } = usePageProps();

  return (
    <div className="space-y-6">
      <FellowshipSalaryActiveCycle />
      <FellowshipSalaryClaimantsList
        claimants={claimants}
        params={fellowshipParams}
        members={fellowshipMembers}
      />
    </div>
  );
}
