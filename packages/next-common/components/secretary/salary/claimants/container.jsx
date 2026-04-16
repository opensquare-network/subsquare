import { useFellowshipSalaryClaimants } from "next-common/hooks/fellowship/salary/useFellowshipSalaryClaimants";
import SecretarySalaryActiveCycle from "next-common/components/secretary/salary/cycles/current";
import SecretarySalaryClaimantsList from "./list";
import { usePageProps } from "next-common/context/page";

export default function SecretarySalaryClaimantsContainer() {
  const { claimants } = useFellowshipSalaryClaimants();
  const { secretaryMembers } = usePageProps();

  return (
    <div className="space-y-6">
      <SecretarySalaryActiveCycle />
      <SecretarySalaryClaimantsList
        claimants={claimants}
        members={secretaryMembers || []}
      />
    </div>
  );
}
