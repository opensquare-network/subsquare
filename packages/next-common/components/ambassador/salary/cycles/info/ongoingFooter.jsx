import FellowshipSalaryBump from "next-common/components/fellowship/salary/actions/bump";
import AmbassadorSalaryPayout from "../../actions/payout";
import AmbassadorSalaryRegister from "../../actions/register";

export default function AmbassadorSalaryCycleDetailInfoOngoingFooter() {
  return (
    <div className="space-y-2">
      {/* my status */}

      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <FellowshipSalaryBump />
        <AmbassadorSalaryRegister />
        <AmbassadorSalaryPayout />
      </div>
    </div>
  );
}
