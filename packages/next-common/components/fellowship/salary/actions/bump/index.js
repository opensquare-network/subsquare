import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { isNil } from "lodash-es";
import PrimaryButton from "next-common/lib/button/primary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import Tooltip from "next-common/components/tooltip";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipSalaryNextCyclePopup = dynamicPopup(() => import("./popup"));

export default function FellowshipSalaryNextCycle() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const address = useRealAddress();

  const { cycleStart } = useFellowshipSalaryStats() || {};
  const { registrationPeriod, payoutPeriod } = useSalaryFellowshipPeriods();
  const nextCycleStart =
    cycleStart + (registrationPeriod || null) + (payoutPeriod || null);
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

  const fnWaitSync = useWaitSyncBlock("Bump successful", () =>
    router.replace(router.asPath),
  );
  const onBump = ({ blockHash }) => blockHash && fnWaitSync(blockHash);

  if (disabled) {
    return (
      <Tooltip content={tooltipText}>
        <PrimaryButton size="small" disabled>
          Start Next Cycle
        </PrimaryButton>
      </Tooltip>
    );
  }

  return (
    <>
      <PrimaryButton size="small" onClick={() => setShowPopup(true)}>
        Start Next Cycle
      </PrimaryButton>
      {showPopup && (
        <FellowshipSalaryNextCyclePopup
          onClose={() => setShowPopup(false)}
          onFinalized={onBump}
        />
      )}
    </>
  );
}
