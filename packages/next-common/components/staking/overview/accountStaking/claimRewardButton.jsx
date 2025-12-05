import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ClaimPoolRewardPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountStaking/claimPoolRewardPopup"
  ),
);

export default function ClaimPoolRewardButton() {
  const [showClaimPopup, setShowClaimPopup] = useState(false);

  return (
    <>
      <div
        role="button"
        className="text-theme500 text12Medium cursor-pointer"
        onClick={() => setShowClaimPopup(true)}
      >
        Claim
      </div>
      {showClaimPopup && (
        <ClaimPoolRewardPopup onClose={() => setShowClaimPopup(false)} />
      )}
    </>
  );
}
