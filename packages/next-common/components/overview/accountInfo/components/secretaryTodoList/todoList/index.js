import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import { getSecretaryMemberSalary } from "next-common/utils/secretary/salary";
import SecretarySalaryRegistrationTodo from "./salaryRegistrationTodo";
import SecretarySalaryPayoutTodo from "./salaryPayoutTodo";

function SecretaryTodoListWithDataLoaded({ member }) {
  const salaryStats = useFellowshipSalaryStats();
  const { claimant, isLoading: isLoadingClaimant } = useMySalaryClaimant();
  const mySalary = getSecretaryMemberSalary(member?.rank ?? 0);

  if (isLoadingClaimant || !salaryStats) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[4px] max-sm:gap-[8px]">
      <SecretarySalaryRegistrationTodo
        claimant={claimant}
        mySalary={mySalary}
        salaryStats={salaryStats}
      />
      <SecretarySalaryPayoutTodo
        claimant={claimant}
        salaryStats={salaryStats}
      />
    </div>
  );
}

export default function SecretaryTodoList({ member }) {
  return <SecretaryTodoListWithDataLoaded member={member} />;
}
