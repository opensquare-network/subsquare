import { useState } from "react";
import RemoveButton from "next-common/components/removeButton";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ReferendumRemovalPopup = dynamicPopup(() => import("./popup"));

const MoonReferendumRemovalPopup = dynamicPopup(() => import("./moonPopup"));

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
