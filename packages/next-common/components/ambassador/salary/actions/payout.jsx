import { isNil, map } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const FellowshipSalaryPayoutPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/payout/popup"),
);

export default function AmbassadorSalaryPayout() {
  const [showPopup, setShowPopup] = useState(false);
  const address = useRealAddress();
  const { members } = useFellowshipCollectiveMembers();
  const memberAddrs = map(members, "address");
  const isCollectiveMember = memberAddrs.includes(address);

  const { cycleStart } = useSelector(ambassadorSalaryStatusSelector) || {};
  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const payoutStart = cycleStart + registrationPeriod || null;
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const isStarted =
    !isNil(latestHeight) && !isNil(payoutStart) && latestHeight >= payoutStart;

  const disabled = !address || !isStarted || !isCollectiveMember;

  const tooltipText = useMemo(() => {
    if (!address) {
      return "Connect your address please";
    } else if (!isCollectiveMember) {
      return "Not a collective member";
    } else if (!isStarted) {
      return "The payout period is not started";
    }

    return null;
  }, [address, isCollectiveMember, isStarted]);

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
