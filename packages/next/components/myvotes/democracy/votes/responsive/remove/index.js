import { useState } from "react";
import RemoveButton from "next-common/components/removeButton";
import ReferendumRemovalPopup from "./popup";
import MoonReferendumRemovalPopup from "./moonPopup";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";

export default function RemoveVoteButton({ referendumIndex }) {
  const [showPop, setShowPop] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let Popup = ReferendumRemovalPopup;
  if (isMoonChain() && isUseMetamask) {
    Popup = MoonReferendumRemovalPopup;
  }

  return (
    <>
      <RemoveButton onClick={() => setShowPop(true)} />
      {showPop && (
        <Popup
          referendumIndex={referendumIndex}
          onClose={() => setShowPop(false)}
        />
      )}
    </>
  );
}
