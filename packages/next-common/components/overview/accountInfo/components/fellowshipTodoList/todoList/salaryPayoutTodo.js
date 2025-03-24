import { useState } from "react";
import TodoTag from "./todoTag";
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
      <div className="flex items-center">
        <TodoTag>Salary</TodoTag>
        <div className="flex flex-wrap text-textPrimary text14Medium items-center">
          The salary cycle is in the payout period.&nbsp;
          <ActionButton onClick={() => setShowPayoutPopup(true)}>
            Claim now
          </ActionButton>
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
