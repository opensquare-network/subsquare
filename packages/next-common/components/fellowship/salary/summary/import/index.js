import { SystemImportMember } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import useFellowshipCollectiveMembers from "next-common/hooks/fellowship/collective/useFellowshipCollectiveMembers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function Import() {
  const [disabled, setDisabled] = useState(true);
  const stats = useSelector(fellowshipSalaryStatusSelector);
  const { isLoading: isLoadingClaimant, claimant } = useMySalaryClaimant();

  const address = useRealAddress();
  const members = useFellowshipCollectiveMembers();
  const memberAddrs = (members || []).map((item) => item.address);

  useEffect(() => {
    if (
      !stats || // Salary cycle not started
      isLoadingClaimant ||
      claimant // it means login address is already imported
    ) {
      setDisabled(true);
    }

    if (memberAddrs.includes(address)) {
      setDisabled(false);
    }
  }, [stats, isLoadingClaimant, claimant, address, memberAddrs]);

  return (
    <>
      <PrimaryButton
        size="small"
        disabled={disabled}
        iconLeft={
          <SystemImportMember className="inline-flex w-4 h-4 [&_path]:stroke-current [&_path]:stroke-2" />
        }
      >
        Import me
      </PrimaryButton>
    </>
  );
}
