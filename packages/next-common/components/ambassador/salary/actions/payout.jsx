import { isNil, map } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import useAmbassadorCollectiveMembers from "next-common/hooks/ambassador/collective/useAmbassadorCollectiveMembers";
import useFellowshipSalaryPeriods from "next-common/hooks/fellowship/salary/useFellowshipSalaryPeriods";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import { useSelector } from "react-redux";

const FellowshipSalaryPayoutPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/payout/popup"),
);

export default function AmbassadorSalaryPayout() {
  const [showPopup, setShowPopup] = useState(false);
  const address = useRealAddress();
  const members = useAmbassadorCollectiveMembers();
  const memberAddrs = map(members, "address");
  const isCollectiveMember = memberAddrs.includes(address);

  const { cycleStart } = useSelector(ambassadorSalaryStatusSelector) || {};
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

  return (
    <>
      <Tooltip content={tooltipText}>
        <PrimaryButton
          disabled={disabled}
          size="small"
          onClick={() => setShowPopup(true)}
        >
          Payout
        </PrimaryButton>
      </Tooltip>

      {showPopup && (
        <FellowshipSalaryPayoutPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
