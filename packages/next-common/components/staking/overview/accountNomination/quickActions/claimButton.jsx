import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";

const ClaimPopup = dynamicPopup(() => import("./claimPopup"));

export default function ClaimNominatorRewardButton({ className }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Claim your staking rewards to your account">
        <div
          role="button"
          className={cn("text-theme500 cursor-pointer", className)}
          onClick={() => setShowPopup(true)}
        >
          Claim
        </div>
      </Tooltip>
      {showPopup && <ClaimPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
