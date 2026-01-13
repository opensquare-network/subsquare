import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

const CompoundPoolRewardPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountStaking/compoundPoolRewardPopup"
  ),
);

export default function CompoundPoolRewardButton() {
  const [showCompoundPopup, setShowCompoundPopup] = useState(false);

  return (
    <>
      <Tooltip content="Compound your staking rewards back into the staking pool">
        <div
          role="button"
          className="text-theme500 text12Medium cursor-pointer"
          onClick={() => setShowCompoundPopup(true)}
        >
          Compound
        </div>
      </Tooltip>
      {showCompoundPopup && (
        <CompoundPoolRewardPopup onClose={() => setShowCompoundPopup(false)} />
      )}
    </>
  );
}
