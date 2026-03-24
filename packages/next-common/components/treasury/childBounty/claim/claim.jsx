import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useChildBountyStatus } from "../useChildBountyStatus";

const Popup = dynamicPopup(() => import("./popup"));

export default function Claim() {
  const onChain = useOnchainData();
  const [showPopup, setShowPopup] = useState(false);
  const chainHeight = useAhmLatestHeight();
  const { parentBountyId, index } = useOnchainData();

  const status = useChildBountyStatus(parentBountyId, index);
  if (status?.type !== "PendingPayout") {
    return null;
  }

  const { unlock_at: unlockAt } = status?.value || {};

  return (
    <>
      <PrimaryButton
        className="w-full"
        disabled={chainHeight < unlockAt}
        onClick={() => setShowPopup(true)}
      >
        Claim
      </PrimaryButton>

      {showPopup && (
        <Popup childBounty={onChain} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
