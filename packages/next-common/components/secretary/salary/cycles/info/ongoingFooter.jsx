import FellowshipSalaryBump from "next-common/components/fellowship/salary/actions/bump";
import SecretarySalaryPayout from "next-common/components/secretary/salary/actions/payout";
import SecretarySalaryRegister from "next-common/components/secretary/salary/actions/register";
import SecretarySalaryMyStatus from "next-common/components/secretary/salary/cycles/myStatus";

export default function SecretarySalaryCycleDetailInfoOngoingFooter() {
  return (
    <div className="space-y-2">
      <SecretarySalaryMyStatus />
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <FellowshipSalaryBump />
        <SecretarySalaryRegister />
        <SecretarySalaryPayout />
      </div>
    </div>
  );
}
