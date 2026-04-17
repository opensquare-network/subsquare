import { useSecretaryMySalaryClaimantFromContext } from "next-common/context/secretary/myClaimant";
import SalaryMyStatusBase from "next-common/components/fellowship/salary/cycles/myStatusBase";

export default function SecretarySalaryMyStatus() {
  const { isLoading, claimant } = useSecretaryMySalaryClaimantFromContext();
  return (
    <SalaryMyStatusBase claimant={claimant} isLoadingClaimant={isLoading} />
  );
}
