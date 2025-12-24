import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

const ClaimPopup = dynamicPopup(() => import("./claimPopup"));

export default function ClaimNominatorRewardButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Claim your staking rewards to your account">
        <div
          role="button"
          className="text-theme500 text12Medium cursor-pointer"
          onClick={() => setShowPopup(true)}
        >
          Claim
        </div>
      </Tooltip>
      {showPopup && <ClaimPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
