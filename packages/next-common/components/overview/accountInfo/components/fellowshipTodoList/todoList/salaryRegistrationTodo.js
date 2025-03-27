import { TodoContent, TodoTag, TodoWrapper } from "./styled";
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
