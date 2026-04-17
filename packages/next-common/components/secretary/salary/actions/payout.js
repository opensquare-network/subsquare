import { useSecretaryMySalaryClaimantFromContext } from "next-common/context/secretary/myClaimant";
import SalaryPayoutBase from "next-common/components/fellowship/salary/actions/payout/base";

export default function SecretarySalaryPayout() {
  const { claimant, isLoading: isLoadingClaimant } =
    useSecretaryMySalaryClaimantFromContext();
  return (
    <SalaryPayoutBase
      claimant={claimant}
      isLoadingClaimant={isLoadingClaimant}
    />
  );
}
