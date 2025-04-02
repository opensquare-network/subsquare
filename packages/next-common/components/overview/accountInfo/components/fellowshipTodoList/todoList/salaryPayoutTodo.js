import { useState } from "react";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import dynamicPopup from "next-common/lib/dynamic/popup";
import ActionButton from "./actionButton";
import { useContextSalaryStats } from "../context/salaryStats";
import { useIsSalaryPayoutPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import { useIsImported, useIsSalaryPayout } from "../context/hooks/mine";

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
      <TodoWrapper>
        <TodoTag>Salary</TodoTag>
        <TodoContent>
          The salary cycle is in the payout period.&nbsp;
          <ActionButton onClick={() => setShowPayoutPopup(true)}>
            Claim now
          </ActionButton>
        </TodoContent>
      </TodoWrapper>
      {showPayoutPopup && (
        <FellowshipSalaryPayoutPopup
          onClose={() => setShowPayoutPopup(false)}
        />
      )}
    </>
  );
}
