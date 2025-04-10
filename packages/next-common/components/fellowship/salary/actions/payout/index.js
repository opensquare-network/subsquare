import React, { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useRegistrationAndPayoutJudgementInfoFromContext } from "next-common/context/fellowship/registrationAndPayoutActions";

const FellowshipSalaryPayoutPopup = dynamicPopup(
  () => import("next-common/components/fellowship/salary/actions/payout/popup"),
);

export default function FellowshipSalaryPayout() {
  const [showPopup, setShowPopup] = useState(false);
  const { payoutJudgementInfo } =
    useRegistrationAndPayoutJudgementInfoFromContext();
  const {
    address,
    claimant,
    isLoading: isLoadingClaimant,
    isStarted,
    isCollectiveMember,
    cycleIndex,
  } = payoutJudgementInfo;

  const paid =
    claimant && claimant.status?.attempted && claimant.lastActive >= cycleIndex;
  const disabled =
    !address ||
    !isStarted ||
    !isCollectiveMember ||
    isLoadingClaimant ||
    !claimant ||
    paid;
  let tooltipText = null;
  if (!address) {
    tooltipText = "Connect your address please";
  } else if (!isCollectiveMember) {
    tooltipText = "Not a collective member";
  } else if (!isStarted) {
    tooltipText = "The payout period is not started";
  } else if (isLoadingClaimant) {
    tooltipText = "Checking your payment status";
  } else if (!claimant) {
    return "Please import yourself first";
  } else if (paid) {
    tooltipText = "Your salary has been paid";
  }

  if (disabled) {
    return (
      <Tooltip content={tooltipText}>
        <PrimaryButton size="small" disabled>
          Payout
        </PrimaryButton>
      </Tooltip>
    );
  }

  return (
    <>
      <PrimaryButton size="small" onClick={() => setShowPopup(true)}>
        Payout
      </PrimaryButton>
      {showPopup && (
        <FellowshipSalaryPayoutPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
