import React, { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import { isNil } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipSalaryPayoutPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/payout/popup"),
);

export default function FellowshipSalaryPayout() {
  const [showPopup, setShowPopup] = useState(false);
  const address = useRealAddress();
  const { members } = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);
  const isCollectiveMember = memberAddrs.includes(address);

  const { cycleStart } = useFellowshipSalaryStats() || {};

  const { registrationPeriod } = useSalaryFellowshipPeriods();
  const payoutStart = cycleStart + registrationPeriod || null;
  const latestHeight = useBlockHeight();
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
