import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

const ClaimPoolRewardPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountStaking/claimPoolRewardPopup"
  ),
);

export default function ClaimPoolRewardButton() {
  const [showClaimPopup, setShowClaimPopup] = useState(false);

  return (
    <>
      <Tooltip content="Claim your staking rewards from the pool to your account">
        <div
          role="button"
          className="text-theme500 text12Medium cursor-pointer"
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
