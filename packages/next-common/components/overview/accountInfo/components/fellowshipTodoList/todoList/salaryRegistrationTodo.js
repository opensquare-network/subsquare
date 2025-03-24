import TodoTag from "./todoTag";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import ActionButton from "./actionButton";
import { useHasSalaryRegistrationTodo } from "../hooks/useHasTodo";

const FellowshipSalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);

export default function SalaryRegistrationTodo() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const hasTodo = useHasSalaryRegistrationTodo();
  if (!hasTodo) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        <TodoTag>Salary</TodoTag>
        <div className="flex flex-wrap text-textPrimary text14Medium items-center">
          The salary cycle is in the registration period,&nbsp;
          <ActionButton onClick={() => setShowRegisterPopup(true)}>
            Register now
          </ActionButton>
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
