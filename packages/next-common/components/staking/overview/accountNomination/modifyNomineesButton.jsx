import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { IconButton } from "next-common/components/styled/iconButton";
import { MenuTreasuryProposal } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";

const ModifyNomineesPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountNomination/modifyNomineesPopup"
  ),
);

export default function ModifyNomineesButton() {
  const [modifyNomineePopup, setModifyNomineePopup] = useState(false);

  return (
    <>
      <Tooltip content="Modify Nominees">
        <IconButton
          className="text-theme500 bg-theme100 [&_svg_path]:fill-theme500"
          onClick={() => setModifyNomineePopup(true)}
        >
          <MenuTreasuryProposal className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {modifyNomineePopup && (
        <ModifyNomineesPopup onClose={() => setModifyNomineePopup(false)} />
      )}
    </>
  );
}
