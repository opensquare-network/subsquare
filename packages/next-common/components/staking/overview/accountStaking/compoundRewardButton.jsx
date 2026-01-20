import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";

const CompoundPoolRewardPopup = dynamicPopup(() =>
  import(
    "next-common/components/staking/overview/accountStaking/compoundPoolRewardPopup"
  ),
);

export default function CompoundPoolRewardButton({ className }) {
  const [showCompoundPopup, setShowCompoundPopup] = useState(false);

  return (
    <>
      <Tooltip content="Compound your staking rewards back into the staking pool">
        <div
          role="button"
          className={cn("text-theme500 cursor-pointer", className)}
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
