import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { isNil } from "lodash-es";
import SecondaryButton from "next-common/lib/button/secondary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useSalaryFellowshipPeriods from "next-common/hooks/fellowship/salary/useSalaryFellowshipPeriods";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import Tooltip from "next-common/components/tooltip";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";

const FellowshipSalaryBumpPopup = dynamicPopup(() => import("./popup"));

export default function FellowshipSalaryBump() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const address = useRealAddress();
  const { section } = useCollectivesContext();
  let statusSelector;
  if (section === "fellowship") {
    statusSelector = fellowshipSalaryStatusSelector;
  } else if (section === "ambassador") {
    statusSelector = ambassadorSalaryStatusSelector;
  }
  const { cycleStart } = useSelector(statusSelector) || {};
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
  const onBump = (_, blockHash) => blockHash && fnWaitSync(blockHash);

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
        <FellowshipSalaryBumpPopup
          onClose={() => setShowPopup(false)}
          onFinalized={onBump}
        />
      )}
    </>
  );
}
