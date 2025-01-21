import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BatchBumpPopup = dynamicPopup(() => import("./popup"));

export default function BatchBump({ isCandidate }) {
  const [showBatchBump, setShowBatchBump] = useState(false);

  return (
    <>
      <PrimaryButton
        size="small"
        onClick={() => {
          setShowBatchBump(true);
        }}
        className="ml-1"
      >
        {isCandidate ? "Offboard" : "Demote"} All
      </PrimaryButton>
      {showBatchBump && (
        <BatchBumpPopup
          isCandidate={isCandidate}
          onClose={() => setShowBatchBump(false)}
        />
      )}
    </>
  );
}
