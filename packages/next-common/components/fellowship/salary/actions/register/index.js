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
import { MaybeTooltip } from "next-common/components/tooltip";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";

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

export default function FellowshipSalaryRegister() {
  const [disabled, setDisabled] = useState(true);
  const address = useRealAddress();
  const members = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);
  const { claimant } = useMySalaryClaimantFromContext();
  const isRegistrationPeriod = useIsInRegistrationPeriod();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (
      !memberAddrs.includes(address) ||
      !isRegistrationPeriod ||
      !claimant
      // todo: salary must > 0
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
    }

    return null;
  }, [isRegistrationPeriod, address, memberAddrs]);

  return (
    <>
      <MaybeTooltip tooltip={tooltipText}>
        <SecondaryButton
          size="small"
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        >
          Register
        </SecondaryButton>
      </MaybeTooltip>
      {showPopup && (
        <FellowshipSalaryRegisterPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
