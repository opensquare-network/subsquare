import { useState } from "react";
import { useIsSalaryPayoutPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import { useIsImported, useIsSalaryPayout } from "../context/hooks/mine";
import { useContextSalaryStats } from "../context/salaryStats";
import ClickableText from "./clickableText";
import TodoTag from "./todoTag";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipSalaryPayoutPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/payout/popup"),
);

export default function SalaryPayoutTodo() {
  const [showPayoutPopup, setShowPayoutPopup] = useState(false);
  const salaryStats = useContextSalaryStats();
  const isInPayoutPeriod = useIsSalaryPayoutPeriod(salaryStats);
  const isImported = useIsImported();
  const isSalaryPayout = useIsSalaryPayout();

  if (!isInPayoutPeriod || !isImported || !isSalaryPayout) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Salary</TodoTag>
        <div className="text-textPrimary text14Medium">
          The salary cycle is in the payout period,&nbsp;
          <ClickableText onClick={() => setShowPayoutPopup(true)}>
            Claim now
          </ClickableText>
        </div>
      </div>
      {showPayoutPopup && (
        <FellowshipSalaryPayoutPopup
          onClose={() => setShowPayoutPopup(false)}
        />
      )}
    </>
  );
}
