import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BatchBumpPopup = dynamicPopup(() => import("./popup"));

export default function BatchBump() {
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
        Bump All
      </PrimaryButton>
      {showBatchBump && (
        <BatchBumpPopup onClose={() => setShowBatchBump(false)} />
      )}
    </>
  );
}
