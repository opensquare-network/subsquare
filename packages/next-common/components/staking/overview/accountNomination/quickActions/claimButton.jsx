import Tooltip from "next-common/components/tooltip";
import { IconButton } from "next-common/components/styled/iconButton";
import { TrackPromotion } from "@osn/icons/subsquare";
import { useState } from "react";
// import dynamicPopup from "next-common/lib/dynamic/popup";

// const ClaimPayoutPopup = dynamicPopup(() =>
//   import("next-common/components/staking/pools/actions/claimPayoutPopup"),
// );

export default function ClaimButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Claim">
        <IconButton
          className="text-theme500 bg-theme100"
          onClick={() => setShowPopup(true)}
        >
          <TrackPromotion className="w-5 h-5" />
        </IconButton>
      </Tooltip>

      {showPopup && (
        <>
          {/* <ClaimPayoutPopup onClose={() => setShowPopup(false)} /> */}
        </>
      )}
    </>
  );
}
