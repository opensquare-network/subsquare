import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const CompoundPoolRewardPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountStaking/compoundPoolRewardPopup"
  ),
);

export default function CompoundPoolRewardButton() {
  const [showCompoundPopup, setShowCompoundPopup] = useState(false);

  return (
    <>
      <div
        role="button"
        className="text-theme500 text12Medium cursor-pointer"
        onClick={() => setShowCompoundPopup(true)}
      >
        Compound
      </div>
      {showCompoundPopup && (
        <CompoundPoolRewardPopup onClose={() => setShowCompoundPopup(false)} />
      )}
    </>
  );
}
