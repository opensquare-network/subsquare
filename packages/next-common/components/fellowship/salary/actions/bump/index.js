import { useState } from "react";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import SecondaryButton from "next-common/lib/button/secondary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import Tooltip from "next-common/components/tooltip";
import FellowshipSalaryBumpPopup from "./popup";

export default function FellowshipSalaryBump() {
  const [showPopup, setShowPopup] = useState(false);
  const address = useRealAddress();

  const { cycleStart } = useSelector(fellowshipSalaryStatusSelector) || {};
  const { registrationPeriod, payoutPeriod } = useFellowshipSalaryPeriods();
  const nextCycleStart =
    cycleStart + registrationPeriod || null + payoutPeriod || null;
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const isStarted =
    !isNil(latestHeight) &&
    !isNil(nextCycleStart) &&
    latestHeight >= nextCycleStart;

  const disabled = !address || !isStarted;
  let tooltipText = null;
  if (!address) {
    tooltipText = "Connect your address please";
  } else if (!isStarted) {
    tooltipText = "Next cycle is not started";
  }

  if (disabled) {
    return (
      <Tooltip content={tooltipText}>
        <SecondaryButton size="small" disabled>
          Bump
        </SecondaryButton>
      </Tooltip>
    );
  }

  return (
    <>
      <SecondaryButton size="small" onClick={() => setShowPopup(true)}>
        Bump
      </SecondaryButton>
      {showPopup && (
        <FellowshipSalaryBumpPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
