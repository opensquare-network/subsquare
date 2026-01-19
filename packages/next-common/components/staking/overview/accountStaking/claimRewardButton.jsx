import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";

const ClaimPoolRewardPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountStaking/claimPoolRewardPopup"
  ),
);

export default function ClaimPoolRewardButton({ className }) {
  const [showClaimPopup, setShowClaimPopup] = useState(false);

  return (
    <>
      <Tooltip content="Claim your staking rewards from the pool to your account">
        <div
          role="button"
          className={cn("text-theme500 cursor-pointer", className)}
          onClick={() => setShowClaimPopup(true)}
        >
          Claim
        </div>
      </Tooltip>
      {showClaimPopup && (
        <ClaimPoolRewardPopup onClose={() => setShowClaimPopup(false)} />
      )}
    </>
  );
}
