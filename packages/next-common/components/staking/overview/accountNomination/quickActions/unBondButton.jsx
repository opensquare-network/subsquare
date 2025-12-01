import Tooltip from "next-common/components/tooltip";
import { IconButton } from "next-common/components/styled/iconButton";
import { SystemSubtract } from "@osn/icons/subsquare";
import { useState } from "react";
// import dynamicPopup from "next-common/lib/dynamic/popup";

// const UnbondPopup = dynamicPopup(() =>
//   import("next-common/components/staking/pools/actions/unBondPopup"),
// );

export default function UnBondButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Unbond">
        <IconButton
          className="text-theme500 bg-theme100"
          onClick={() => setShowPopup(true)}
        >
          <SystemSubtract className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {showPopup && (
        <>{/* <UnbondPopup  onClose={() => setShowPopup(false)} /> */}</>
      )}
    </>
  );
}
