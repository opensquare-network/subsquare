import { SystemImportMember } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import PrimaryButton from "next-common/lib/button/primary";
import { useEffect, useState } from "react";

export default function Import() {
  const [showPopup, setShowPopup] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(true);
  }, []);

  return (
    <>
      <Tooltip content={""}>
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
      {showPopup && null}
    </>
  );
}
