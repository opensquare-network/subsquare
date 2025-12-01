import Tooltip from "next-common/components/tooltip";
import { IconButton } from "next-common/components/styled/iconButton";
import { SystemPlus } from "@osn/icons/subsquare";
import { useState } from "react";
// import dynamicPopup from "next-common/lib/dynamic/popup";

// const BondPopup = dynamicPopup(() =>
//   import("next-common/components/staking/pools/actions/bondPopup"),
// );

export default function BondButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Bond">
        <IconButton
          className="text-theme500 bg-theme100"
          onClick={() => setShowPopup(true)}
        >
          <SystemPlus className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {showPopup && (
        <>{/* <BondPopup onClose={() => setShowPopup(false)} /> */}</>
      )}
    </>
  );
}
