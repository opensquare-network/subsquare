import { useSecretaryMySalaryClaimantFromContext } from "next-common/context/secretary/myClaimant";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { getSecretaryMemberSalary } from "next-common/utils/secretary/salary";
import SalaryRegisterBase from "next-common/components/fellowship/salary/actions/register/base";

function useMySalary() {
  const { members } = useFellowshipCollectiveMembers();
  const address = useRealAddress();
  if (!address || !members) return 0;
  const member = members.find((m) => isSameAddress(m.address, address));
  return getSecretaryMemberSalary(member?.rank ?? 0);
}

export default function SecretarySalaryRegister() {
  const { claimant } = useSecretaryMySalaryClaimantFromContext();
  const mySalary = useMySalary();
  return <SalaryRegisterBase claimant={claimant} mySalary={mySalary} />;
}
