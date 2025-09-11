import React, { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { useIsSalaryPayoutPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import useSalaryClaimant from "next-common/hooks/fellowship/salary/useSalaryClaimant";
import useFellowshipMemberDetailAddr from "next-common/hooks/collectives/member/detail";

const FellowshipSalaryPayoutPopup = dynamicPopup(
  () => import("next-common/components/fellowship/salary/actions/payout/popup"),
);

function Payout({ className = "" }) {
  const [showPopup, setShowPopup] = useState(false);
  const status = useFellowshipSalaryStats();
  const address = useFellowshipMemberDetailAddr();
  const { isLoading: isLoadingClaimant, claimant } = useSalaryClaimant(address);
  const { cycleIndex } = status || {};
  const isStarted = useIsSalaryPayoutPeriod(status);

  const paid = claimant.status?.attempted && claimant.lastActive >= cycleIndex;
  const disabled = !isStarted || isLoadingClaimant || !claimant || paid;

  let tooltipText = null;
  if (!isStarted) {
    tooltipText = "The payout period is not started";
  } else if (isLoadingClaimant) {
    tooltipText = "Checking your payment status";
  } else if (paid) {
    tooltipText = "Your salary has been paid";
  }

  return (
    <>
      <Tooltip content={tooltipText}>
        <SecondaryButton
          size="small"
          className={cn(
            "border-none",
            "text14Medium",
            "p-0",
            !disabled && "!text-theme500",
            className,
          )}
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        >
          Payout
        </SecondaryButton>
      </Tooltip>
      {showPopup && (
        <FellowshipSalaryPayoutPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}

export default React.memo(Payout);
