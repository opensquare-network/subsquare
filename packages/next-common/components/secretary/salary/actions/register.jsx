import SecondaryButton from "next-common/lib/button/secondary";
import React, { useEffect, useMemo, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import Tooltip from "next-common/components/tooltip";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import useClaimantsFellowshipUpdateFunc from "next-common/hooks/fellowship/salary/useClaimantsUpdateFunc";
import { isSameAddress } from "next-common/utils";

// secretary: rank >= 1 (SECRETARY role) has salary; rank 0 (CANDIDATE) has no salary
function useMySecretarySalaryEligible() {
  const { members } = useFellowshipCollectiveMembers();
  const address = useRealAddress();
  if (!address || !members) return false;
  const member = members.find((m) => isSameAddress(m.address, address));
  return (member?.rank ?? 0) >= 1;
}

const FellowshipSalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);

export default function SecretarySalaryRegister() {
  const [disabled, setDisabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const address = useRealAddress();
  const { members } = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);
  const { claimant } = useMySalaryClaimantFromContext();
  const status = useFellowshipSalaryStats();
  const isRegistrationPeriod = useIsInSalaryRegistrationPeriod(status);
  const hasSalary = useMySecretarySalaryEligible();
  const onInBlock = useClaimantsFellowshipUpdateFunc();

  useEffect(() => {
    if (
      !status ||
      !memberAddrs.includes(address) ||
      !isRegistrationPeriod ||
      !claimant ||
      !hasSalary ||
      claimant.lastActive >= status.cycleIndex
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [isRegistrationPeriod, address, memberAddrs, status, claimant, hasSalary]);

  const tooltipText = useMemo(() => {
    if (!isRegistrationPeriod) {
      return "Not in registration period";
    } else if (!address) {
      return "Connect your address please";
    } else if (!memberAddrs.includes(address)) {
      return "Not a collective member";
    } else if (!claimant) {
      return "Please import yourself first";
    } else if (!hasSalary) {
      return "No salary for your rank";
    } else if (claimant.lastActive >= status?.cycleIndex) {
      return "Already registered";
    }
    return null;
  }, [
    isRegistrationPeriod,
    address,
    memberAddrs,
    claimant,
    hasSalary,
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
        />
      )}
    </>
  );
}
