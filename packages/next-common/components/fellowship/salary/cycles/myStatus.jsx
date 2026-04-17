import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import SalaryMyStatusBase from "./myStatusBase";

export default function FellowshipSalaryMyStatus() {
  const { isLoading, claimant } = useMySalaryClaimantFromContext();
  return (
    <SalaryMyStatusBase claimant={claimant} isLoadingClaimant={isLoading} />
  );
}
