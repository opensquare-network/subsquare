import React, { useEffect, useMemo, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import useSalaryClaimant from "next-common/hooks/fellowship/salary/useSalaryClaimant";
import useFellowshipMemberDetailAddr from "next-common/hooks/collectives/member/detail";

const FellowshipSalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);

function Register({ className = "" }) {
  const [showPopup, setShowPopup] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const status = useFellowshipSalaryStats();
  const isRegistrationPeriod = useIsInSalaryRegistrationPeriod(status);
  const address = useFellowshipMemberDetailAddr();
  const { claimant } = useSalaryClaimant(address);

  useEffect(() => {
    if (
      !status ||
      !isRegistrationPeriod ||
      !claimant ||
      claimant.lastActive >= status.cycleIndex
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [isRegistrationPeriod, status, claimant]);

  const tooltipText = useMemo(() => {
    if (!isRegistrationPeriod) {
      return "Not in registration period";
    } else if (!claimant) {
      return "Please import yourself first";
    } else if (claimant.lastActive >= status?.cycleIndex) {
      return "Already registered";
    }

    return null;
  }, [isRegistrationPeriod, claimant, status?.cycleIndex]);

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
          Register
        </SecondaryButton>
      </Tooltip>

      {showPopup && (
        <FellowshipSalaryRegisterPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}

export default React.memo(Register);
