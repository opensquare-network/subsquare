import { useState } from "react";
import RemoveButton from "next-common/components/removeButton";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ReferendumRemovalPopup = dynamicPopup(() => import("./popup"));

export default function RemoveVoteButton({ referendumIndex }) {
  const [showPop, setShowPop] = useState(false);

  return (
    <>
      <RemoveButton onClick={() => setShowPop(true)} />
      {showPop && (
        <ReferendumRemovalPopup
          referendumIndex={referendumIndex}
          onClose={() => setShowPop(false)}
        />
      )}
    </>
  );
}
