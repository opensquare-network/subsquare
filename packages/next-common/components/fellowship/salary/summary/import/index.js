import React, { useEffect, useMemo, useState } from "react";
import { SystemImportMember } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { useSelector } from "react-redux";
import {
  fellowshipSalaryStatusSelector,
  salaryStatusLoadedSelector,
} from "next-common/store/reducers/fellowship/salary";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useMySalaryClaimantFromContext } from "next-common/context/fellowship/myClaimant";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipSalaryImportPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/summary/import/popup"),
);

export default function Import() {
  const [showPopup, setShowPopup] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const stats = useSelector(fellowshipSalaryStatusSelector);
  const statusLoaded = useSelector(salaryStatusLoadedSelector);
  const { isLoading: isLoadingClaimant, claimant } =
    useMySalaryClaimantFromContext();

  const address = useRealAddress();
  const { members } = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);

  useEffect(() => {
    if (
      !stats || // Salary cycle not started
      isLoadingClaimant ||
      claimant // it means login address is already imported
    ) {
      setDisabled(true);
    } else if (memberAddrs.includes(address)) {
      setDisabled(false);
    }
  }, [stats, isLoadingClaimant, claimant, address, memberAddrs]);

  const tooltipText = useMemo(() => {
    if (!statusLoaded) {
      return "Checking salary cycle status";
    } else if (!stats) {
      return "Salary cycle is not started";
    } else if (isLoadingClaimant) {
      return "Checking claimant status";
    } else if (claimant) {
      return "Already inducted";
    } else if (!address) {
      return "Connect your address please";
    } else if (!memberAddrs.includes(address)) {
      return "Not a collective member";
    }

    return null;
  }, [stats, statusLoaded, isLoadingClaimant, claimant, address, memberAddrs]);

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
        <FellowshipSalaryImportPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
