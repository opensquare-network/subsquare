import SecondaryButton from "next-common/lib/button/secondary";
import React, { useEffect, useMemo, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import Tooltip from "next-common/components/tooltip";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import { usePageProps } from "next-common/context/page";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { isSameAddress } from "next-common/utils";

const FellowshipSalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);

function useMySalary() {
  const { section } = useCollectivesContext();
  const { members } = useFellowshipCollectiveMembers();
  const address = useRealAddress();
  const member = members.find((m) => isSameAddress(m.address, address));
  const { fellowshipParams, ambassadorParams } = usePageProps();

  let params;
  if (section === "fellowship") {
    params = fellowshipParams;
  } else if (section === "ambassador") {
    params = ambassadorParams;
  }

  const { member: coreMember, isLoading } = useMySalaryClaimantFromContext();
  if (!member || !coreMember || isLoading) {
    return 0;
  }

  const { activeSalary = [], passiveSalary = [] } = params || {};
  const rank = member.rank;
  const { isActive } = coreMember || {};
  const salaryArray = isActive ? activeSalary : passiveSalary;
  return salaryArray[rankToIndex(rank)];
}

export default function FellowshipSalaryRegister() {
  const [disabled, setDisabled] = useState(true);
  const address = useRealAddress();
  const { members } = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);
  const { claimant } = useMySalaryClaimantFromContext();
  const [showPopup, setShowPopup] = useState(false);
  const status = useFellowshipSalaryStats();

  const isRegistrationPeriod = useIsInSalaryRegistrationPeriod(status);
  const mySalary = useMySalary();

  useEffect(() => {
    if (
      !status ||
      !memberAddrs.includes(address) ||
      !isRegistrationPeriod ||
      !claimant ||
      mySalary <= 0 ||
      claimant.lastActive >= status.cycleIndex
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [isRegistrationPeriod, address, memberAddrs, status, claimant, mySalary]);

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
        <FellowshipSalaryRegisterPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
