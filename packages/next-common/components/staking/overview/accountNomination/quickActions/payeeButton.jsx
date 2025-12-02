import Tooltip from "next-common/components/tooltip";
import { IconButton } from "next-common/components/styled/iconButton";
import { TrackFastPromotion } from "@osn/icons/subsquare";
import { useState } from "react";
// import dynamicPopup from "next-common/lib/dynamic/popup";

// const PayeePopup = dynamicPopup(() =>
//   import("next-common/components/staking/pools/actions/payeePopup"),
// );

// Update Payout Destination
export default function PayeeButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Payee">
        <IconButton
          className="text-theme500 bg-theme100"
          onClick={() => setShowPopup(true)}
        >
          <TrackFastPromotion className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {showPopup && (
        <>
          {/* <PayeePopuponClose={() => setShowPopup(false)}
          /> */}
        </>
      )}
    </>
  );
}
