import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import ActionButton from "./actionButton";
import { useContextSalaryStats } from "../context/salaryStats";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import {
  useIsImported,
  useIsSalaryRegistered,
  useMySalary,
} from "../context/hooks/mine";

const FellowshipSalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);

export default function SalaryRegistrationTodo() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  const salaryStats = useContextSalaryStats();
  const isInRegistrationPeriod = useIsInSalaryRegistrationPeriod(salaryStats);
  const isImported = useIsImported();
  const isSalaryRegistered = useIsSalaryRegistered();
  const mySalary = useMySalary();

  if (
    !isInRegistrationPeriod ||
    !isImported ||
    isSalaryRegistered ||
    !mySalary
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
        <FellowshipSalaryRegisterPopup
          onClose={() => setShowRegisterPopup(false)}
        />
      )}
    </>
  );
}
