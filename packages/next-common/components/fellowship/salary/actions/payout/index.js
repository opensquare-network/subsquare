import PrimaryButton from "next-common/lib/button/primary";
import React, { useState } from "react";
import FellowshipSalaryPayoutPopup from "next-common/components/fellowship/salary/actions/payout/popup";
import Tooltip from "next-common/components/tooltip";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { isNil } from "lodash-es";

export default function FellowshipSalaryRegister() {
  const [showPopup, setShowPopup] = useState(false);

  const { cycleStart } = useSelector(fellowshipSalaryStatusSelector);
  const { registrationPeriod } = useFellowshipSalaryPeriods();
  const payoutStart = cycleStart + registrationPeriod || null;
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const isStarted =
    !isNil(latestHeight) && !isNil(payoutStart) && latestHeight >= payoutStart;

  if (!isStarted) {
    return (
      <Tooltip content={"The payout period is not started"}>
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
