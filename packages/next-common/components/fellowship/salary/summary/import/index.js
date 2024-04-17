import { SystemImportMember } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { useEffect, useState } from "react";
import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";

export default function Import() {
  // todo: 1. query status and set disabled status
  const [disabled, setDisabled] = useState(false);
  const stats = useSubFellowshipSalaryStats(); // todo: save salary status to redux
  useEffect(() => {
    if (!stats) {
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
