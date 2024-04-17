import { SystemImportMember } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";

export default function Import() {
  const [disabled, setDisabled] = useState(true);
  const stats = useSelector(fellowshipSalaryStatusSelector);
  const claimant = useMySalaryClaimant();
  // todo: 2. save members to redux, check if login user is a member, and set disabled if not
  useEffect(() => {
    if (
      !stats ||
      claimant // it means login address is already imported
    ) {
      setDisabled(false);
    }
  }, [stats]);

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
