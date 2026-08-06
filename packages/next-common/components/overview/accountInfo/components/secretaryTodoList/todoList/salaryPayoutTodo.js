import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useIsSalaryPayoutPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import ActionButton from "../../fellowshipTodoList/todoList/actionButton";
import {
  TodoContent,
  TodoTag,
  TodoWrapper,
} from "../../fellowshipTodoList/todoList/styled";

const SecretarySalaryPayoutPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/payout/popup"),
);

export default function SecretarySalaryPayoutTodo({ claimant, salaryStats }) {
  const [showPayoutPopup, setShowPayoutPopup] = useState(false);
  const isInPayoutPeriod = useIsSalaryPayoutPeriod(salaryStats);
  const isPaid =
    claimant?.status?.attempted &&
    claimant.lastActive >= salaryStats.cycleIndex;

  if (!isInPayoutPeriod || !claimant || isPaid) {
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
        <SecretarySalaryPayoutPopup onClose={() => setShowPayoutPopup(false)} />
      )}
    </>
  );
}
