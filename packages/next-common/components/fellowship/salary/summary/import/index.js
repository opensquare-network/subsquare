import { SystemImportMember } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";

export default function Import() {
  const [disabled, setDisabled] = useState(true);
  const stats = useSelector(fellowshipSalaryStatusSelector);
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
