import Tooltip from "next-common/components/tooltip";
import { IconButton } from "next-common/components/styled/iconButton";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { SystemTop } from "@osn/icons/subsquare";

const ClaimPayoutPopup = dynamicPopup(() => import("./claimPopup"));

export default function ClaimButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Claim">
        <IconButton
          className="text-theme500 bg-theme100"
          onClick={() => setShowPopup(true)}
        >
          <SystemTop className="w-5 h-5 rotate-180" />
        </IconButton>
      </Tooltip>

      {showPopup && <ClaimPayoutPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
