import SecondaryButton from "next-common/lib/button/secondary";
import React, { useEffect, useMemo, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useFellowshipCollectiveMembers from "next-common/hooks/fellowship/collective/useFellowshipCollectiveMembers";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { isNil } from "lodash-es";
import FellowshipSalaryRegisterPopup from "next-common/components/fellowship/salary/actions/register/popup";
import Tooltip from "next-common/components/tooltip";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import { usePageProps } from "next-common/context/page";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";

function useIsInRegistrationPeriod() {
  const stats = useSelector(fellowshipSalaryStatusSelector);
  const { registrationPeriod } = useFellowshipSalaryPeriods();
  const latestHeight = useSelector(chainOrScanHeightSelector);

  if (isNil(latestHeight) || isNil(stats) || isNil(registrationPeriod)) {
    return false;
  }

  const { cycleStart } = stats;
  return cycleStart + registrationPeriod > latestHeight;
}

function useMySalary() {
  const members = useFellowshipCollectiveMembers();
  const address = useRealAddress();
  const member = members.find((m) => m.address === address);
  const { fellowshipParams } = usePageProps();
  const { member: coreMember, isLoading } = useMySalaryClaimantFromContext();
  if (!member || isLoading) {
    return 0;
  }

  const { activeSalary = [], passiveSalary = [] } = fellowshipParams || {};
  const rank = member.rank;
  const { isActive } = coreMember;
  const salaryArray = isActive ? activeSalary : passiveSalary;
  return salaryArray[rankToIndex(rank)];
}

export default function FellowshipSalaryRegister() {
  const [disabled, setDisabled] = useState(true);
  const address = useRealAddress();
  const members = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);
  const { claimant } = useMySalaryClaimantFromContext();
  const isRegistrationPeriod = useIsInRegistrationPeriod();
  const [showPopup, setShowPopup] = useState(false);
  const status = useSelector(fellowshipSalaryStatusSelector);
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
  }, [isRegistrationPeriod, address, memberAddrs]);

  const tooltipText = useMemo(() => {
    if (!isRegistrationPeriod) {
      return "Not in registration period";
    } else if (!claimant) {
      return "Please import yourself first";
    } else if (!address) {
      return "Connect your address please";
    } else if (!memberAddrs.includes(address)) {
      return "Not a collective member";
    } else if (mySalary <= 0) {
      return "No salary to claim";
    } else if (claimant.lastActive >= status?.cycleIndex) {
      return "Already registered";
    }

    return null;
  }, [isRegistrationPeriod, address, memberAddrs]);

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
