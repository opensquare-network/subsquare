import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import SalaryPayoutBase from "./base";

export default function FellowshipSalaryPayout() {
  const { claimant, isLoading: isLoadingClaimant } =
    useMySalaryClaimantFromContext();
  return (
    <SalaryPayoutBase
      claimant={claimant}
      isLoadingClaimant={isLoadingClaimant}
    />
  );
}
