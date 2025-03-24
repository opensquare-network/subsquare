import { useState } from "react";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import dynamicPopup from "next-common/lib/dynamic/popup";
import ActionButton from "./actionButton";
import { useHasSalaryPayoutTodo } from "../hooks/useHasTodo";

const FellowshipSalaryPayoutPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/payout/popup"),
);

export default function SalaryPayoutTodo() {
  const [showPayoutPopup, setShowPayoutPopup] = useState(false);
  const hasTodo = useHasSalaryPayoutTodo();
  if (!hasTodo) {
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
