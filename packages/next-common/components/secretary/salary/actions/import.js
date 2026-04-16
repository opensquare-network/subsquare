import { useSecretaryMySalaryClaimantFromContext } from "next-common/context/secretary/myClaimant";
import SalaryImportBase from "next-common/components/fellowship/salary/summary/import/base";

export default function SecretarySalaryImport() {
  const { claimant, isLoading: isLoadingClaimant } =
    useSecretaryMySalaryClaimantFromContext();
  return (
    <SalaryImportBase
      claimant={claimant}
      isLoadingClaimant={isLoadingClaimant}
    />
  );
}
