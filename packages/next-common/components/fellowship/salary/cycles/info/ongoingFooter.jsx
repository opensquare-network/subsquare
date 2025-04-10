import FellowshipSalaryBump from "../../actions/bump";
import FellowshipSalaryPayout from "../../actions/payout";
import FellowshipSalaryRegister from "../../actions/register";
import FellowshipSalaryMyStatus from "../myStatus";
import RegistrationAndPayoutActionsProvider from "next-common/context/fellowship/registrationAndPayoutActions";

export default function FellowshipSalaryCycleDetailInfoOngoingFooter() {
  return (
    <div className="space-y-2">
      <FellowshipSalaryMyStatus />
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <FellowshipSalaryBump />
        <RegistrationAndPayoutActionsProvider>
          <FellowshipSalaryRegister />
          <FellowshipSalaryPayout />
        </RegistrationAndPayoutActionsProvider>
      </div>
    </div>
  );
}
