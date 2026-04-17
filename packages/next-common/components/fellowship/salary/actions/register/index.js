import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import { useMySalary } from "next-common/components/fellowship/salary/actions/hooks/useMyAccountSalaryWithSymbol";
import SalaryRegisterBase from "./base";

export default function FellowshipSalaryRegister() {
  const { claimant } = useMySalaryClaimantFromContext();
  const mySalary = useMySalary();
  return <SalaryRegisterBase claimant={claimant} mySalary={mySalary} />;
}
