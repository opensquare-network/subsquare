import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import useClaimantsFellowshipUpdateFunc from "next-common/hooks/fellowship/salary/useClaimantsUpdateFunc";
import ActionButton from "../../fellowshipTodoList/todoList/actionButton";
import {
  TodoContent,
  TodoTag,
  TodoWrapper,
} from "../../fellowshipTodoList/todoList/styled";

const SecretarySalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);

export default function SecretarySalaryRegistrationTodo({
  claimant,
  mySalary,
  salaryStats,
}) {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const isInRegistrationPeriod = useIsInSalaryRegistrationPeriod(salaryStats);
  const isSalaryRegistered = claimant?.lastActive >= salaryStats.cycleIndex;
  const onInBlock = useClaimantsFellowshipUpdateFunc();

  if (
    !isInRegistrationPeriod ||
    !claimant ||
    isSalaryRegistered ||
    mySalary <= 0
  ) {
    return null;
  }

  return (
    <>
      <TodoWrapper>
        <TodoTag>Salary</TodoTag>
        <TodoContent>
          The salary cycle is in the registration period,&nbsp;
          <ActionButton onClick={() => setShowRegisterPopup(true)}>
            Register now
          </ActionButton>
        </TodoContent>
      </TodoWrapper>
      {showRegisterPopup && (
        <SecretarySalaryRegisterPopup
          onClose={() => setShowRegisterPopup(false)}
          onInBlock={onInBlock}
          onFinalized={onInBlock}
        />
      )}
    </>
  );
}
