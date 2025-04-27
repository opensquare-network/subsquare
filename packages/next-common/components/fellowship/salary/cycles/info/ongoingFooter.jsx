import FellowshipSalaryBump from "../../actions/bump";
import FellowshipSalaryPayout from "../../actions/payout";
import FellowshipSalaryRegister from "../../actions/register";
import FellowshipSalaryMyStatus from "../myStatus";

export default function FellowshipSalaryCycleDetailInfoOngoingFooter() {
  return (
    <div className="space-y-2">
      <FellowshipSalaryMyStatus />
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <FellowshipSalaryRegister />
        <FellowshipSalaryPayout />
        <FellowshipSalaryBump />
      </div>
    </div>
  );
}
