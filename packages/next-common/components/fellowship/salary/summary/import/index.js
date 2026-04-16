import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import SalaryImportBase from "./base";

export default function Import() {
  const { claimant, isLoading: isLoadingClaimant } =
    useMySalaryClaimantFromContext();
  return (
    <SalaryImportBase
      claimant={claimant}
      isLoadingClaimant={isLoadingClaimant}
    />
  );
}
