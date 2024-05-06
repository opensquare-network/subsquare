import React, { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import FellowshipSalaryPayoutPopup from "next-common/components/fellowship/salary/actions/payout/popup";
import Tooltip from "next-common/components/tooltip";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { isNil } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useFellowshipCollectiveMembers from "next-common/hooks/fellowship/collective/useFellowshipCollectiveMembers";

export default function FellowshipSalaryRegister() {
  const [showPopup, setShowPopup] = useState(false);
  const address = useRealAddress();
  const members = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);
  const isCollectiveMember = memberAddrs.includes(address);

  const { cycleStart } = useSelector(fellowshipSalaryStatusSelector) || {};
  const { registrationPeriod } = useFellowshipSalaryPeriods();
  const payoutStart = cycleStart + registrationPeriod || null;
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const isStarted =
    !isNil(latestHeight) && !isNil(payoutStart) && latestHeight >= payoutStart;

  const disabled = !address || !isStarted || !isCollectiveMember;
  let tooltipText = null;
  if (!address) {
    tooltipText = "Connect your address please";
  } else if (!isCollectiveMember) {
    tooltipText = "Not a collective member";
  } else if (!isStarted) {
    tooltipText = "The payout period is not started";
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
