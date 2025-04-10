import SecondaryButton from "next-common/lib/button/secondary";
import React, { useMemo, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useRegistrationAndPayoutJudgementInfoFromContext } from "next-common/context/fellowship/registrationAndPayoutActions";

const FellowshipSalaryRegisterPopup = dynamicPopup(
  () =>
    import("next-common/components/fellowship/salary/actions/register/popup"),
);

export default function FellowshipSalaryRegister() {
  const [showPopup, setShowPopup] = useState(false);
  const { registrationJudgementInfo } =
    useRegistrationAndPayoutJudgementInfoFromContext();
  const {
    isRegistrationPeriod,
    address,
    memberAddrs,
    claimant,
    mySalary,
    onInBlock,
    status,
  } = registrationJudgementInfo;

  let disabled =
    !status ||
    !memberAddrs.includes(address) ||
    !isRegistrationPeriod ||
    !claimant ||
    mySalary <= 0 ||
    claimant.lastActive >= status.cycleIndex;

  const tooltipText = useMemo(() => {
    if (!isRegistrationPeriod) {
      return "Not in registration period";
    } else if (!address) {
      return "Connect your address please";
    } else if (!memberAddrs.includes(address)) {
      return "Not a collective member";
    } else if (!claimant) {
      return "Please import yourself first";
    } else if (mySalary <= 0) {
      return "No salary to claim";
    } else if (claimant.lastActive >= status?.cycleIndex) {
      return "Already registered";
    }

    return null;
  }, [
    isRegistrationPeriod,
    address,
    memberAddrs,
    claimant,
    mySalary,
    status?.cycleIndex,
  ]);

  return (
    <>
      <Tooltip content={tooltipText}>
        <SecondaryButton
          size="small"
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        >
          Register
        </SecondaryButton>
      </Tooltip>
      {showPopup && (
        <FellowshipSalaryRegisterPopup
          onClose={() => setShowPopup(false)}
          onInBlock={onInBlock}
          onFinalized={onInBlock}
        />
      )}
    </>
  );
}
