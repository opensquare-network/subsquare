import Tooltip from "next-common/components/tooltip";
import { IconButton } from "next-common/components/styled/iconButton";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { MenuCouncil } from "@osn/icons/subsquare";

const PayeePopup = dynamicPopup(() => import("./payeePopup"));

export default function PayeeButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Set Payee">
        <IconButton
          className="text-theme500 bg-theme100"
          onClick={() => setShowPopup(true)}
        >
          <MenuCouncil className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {showPopup && <PayeePopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
