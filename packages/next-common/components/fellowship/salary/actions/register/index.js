import SecondaryButton from "next-common/lib/button/secondary";
import React, { useEffect, useState } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useFellowshipCollectiveMembers from "next-common/hooks/fellowship/collective/useFellowshipCollectiveMembers";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { isNil } from "lodash-es";
import FellowshipSalaryRegisterPopup from "next-common/components/fellowship/salary/actions/register/popup";

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
  const { claimant } = useMySalaryClaimant();
  const stats = useSelector(fellowshipSalaryStatusSelector);
  const isRegistrationPeriod = useIsInRegistrationPeriod();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (
      !memberAddrs.includes(address) ||
      !isRegistrationPeriod ||
      claimant?.lastActive >= stats?.cycleIndex
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [isRegistrationPeriod, address, memberAddrs]);

  return (
    <>
      <SecondaryButton
        size="small"
        disabled={disabled}
        onClick={() => setShowPopup(true)}
      >
        Register
      </SecondaryButton>
      {showPopup && (
        <FellowshipSalaryRegisterPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
