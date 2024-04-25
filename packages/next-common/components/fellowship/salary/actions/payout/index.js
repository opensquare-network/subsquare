import PrimaryButton from "next-common/lib/button/primary";
import React, { useState } from "react";
import FellowshipSalaryPayoutPopup from "next-common/components/fellowship/salary/actions/payout/popup";
import Tooltip from "next-common/components/tooltip";

export default function FellowshipSalaryRegister() {
  const [disabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <Tooltip content={"The fellowship salary has been paid"}>
        <PrimaryButton
          size="small"
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        >
          Payout
        </PrimaryButton>
      </Tooltip>
      {showPopup && (
        <FellowshipSalaryPayoutPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
