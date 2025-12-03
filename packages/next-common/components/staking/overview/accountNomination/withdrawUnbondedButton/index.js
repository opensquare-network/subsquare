import { useState } from "react";
import WithdrawUnbondedPopup from "../WithdrawUnbondedPopup";

export default function WithdrawUnbondedButton() {
  const [showWithdrawUnbondedPopup, setShowWithdrawUnbondedPopup] =
    useState(false);

  return (
    <>
      <div
        role="button"
        className="text-theme500 text12Medium cursor-pointer"
        onClick={() => setShowWithdrawUnbondedPopup(true)}
      >
        Withdraw
      </div>
      {showWithdrawUnbondedPopup && (
        <WithdrawUnbondedPopup
          onClose={() => setShowWithdrawUnbondedPopup(false)}
        />
      )}
    </>
  );
}
