import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import {
  useIsImported,
  useIsSalaryRegistered,
  useMySalary,
} from "../context/hooks/mine";
import { useContextSalaryStats } from "../context/salaryStats";
import ClickableText from "./clickableText";
import TodoTag from "./todoTag";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

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
      <div className="flex items-center">
        <TodoTag>Salary</TodoTag>
        <div className="text-textPrimary text14Medium">
          The salary cycle is in the registration period,&nbsp;
          <ClickableText onClick={() => setShowRegisterPopup(true)}>
            Register now
          </ClickableText>
        </div>
      </div>
      {showRegisterPopup && (
        <FellowshipSalaryRegisterPopup
          onClose={() => setShowRegisterPopup(false)}
        />
      )}
    </>
  );
}
