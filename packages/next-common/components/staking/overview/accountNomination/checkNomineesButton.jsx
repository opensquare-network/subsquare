import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { IconButton } from "next-common/components/styled/iconButton";
import { SystemMenu } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";

const NomineeListPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountNomination/nomineeListPopup"
  ),
);

export default function CheckNomineesButton({ nominator }) {
  const [showNomineePopup, setShowNomineePopup] = useState(false);

  return (
    <>
      <Tooltip content="Show Nominees">
        <IconButton
          className="text-theme500 bg-theme100 [&_svg_path]:stroke-theme500"
          onClick={() => setShowNomineePopup(true)}
        >
          <SystemMenu className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {showNomineePopup && (
        <NomineeListPopup
          nominator={nominator}
          onClose={() => setShowNomineePopup(false)}
        />
      )}
    </>
  );
}
