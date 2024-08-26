import { SystemImportMember } from "@osn/icons/subsquare";
import { map } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useMyAmbassadorSalaryClaimantFromContext } from "next-common/context/ambassador/myClaimant";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";

const FellowshipSalaryImportPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/summary/import/popup"),
);

export default function Import() {
  const [showPopup, setShowPopup] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const stats = useFellowshipSalaryStats();
  const statusLoaded = !!stats;
  const { isLoading: isLoadingClaimant, claimant } =
    useMyAmbassadorSalaryClaimantFromContext();

  const realAddress = useRealAddress();
  const { members } = useFellowshipCollectiveMembers();
  const memberAddrs = map(members, "address");

  useEffect(() => {
    if (
      !stats || // Salary cycle not started
      isLoadingClaimant ||
      claimant // it means login address is already imported
    ) {
      setDisabled(true);
    } else if (memberAddrs.includes(realAddress)) {
      setDisabled(false);
    }
  }, [stats, isLoadingClaimant, claimant, realAddress, memberAddrs]);

  const tooltipText = useMemo(() => {
    if (!statusLoaded) {
      return "Checking salary cycle status";
    } else if (!stats) {
      return "Salary cycle is not started";
    } else if (isLoadingClaimant) {
      return "Checking claimant status";
    } else if (claimant) {
      return "Already inducted";
    } else if (!realAddress) {
      return "Connect your address please";
    } else if (!memberAddrs.includes(realAddress)) {
      return "Not a collective member";
    }

    return null;
  }, [
    stats,
    statusLoaded,
    isLoadingClaimant,
    claimant,
    realAddress,
    memberAddrs,
  ]);

  return (
    <>
      <Tooltip content={tooltipText}>
        <PrimaryButton
          size="small"
          disabled={disabled}
          iconLeft={
            <SystemImportMember className="inline-flex w-4 h-4 [&_path]:stroke-current [&_path]:stroke-2" />
          }
          onClick={() => setShowPopup(true)}
        >
          Import me
        </PrimaryButton>
      </Tooltip>
      {showPopup && (
        <FellowshipSalaryImportPopup
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
