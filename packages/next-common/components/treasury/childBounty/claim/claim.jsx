import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { has } from "lodash-es";

const Popup = dynamicPopup(() => import("./popup"));

export default function Claim() {
  const onChain = useOnchainData();
  const [showPopup, setShowPopup] = useState(false);
  const chainHeight = useAhmLatestHeight();

  const { status } = onChain?.meta ?? {};

  if (!has(status, "pendingPayout")) {
    return null;
  }
  const { unlockAt } = status?.pendingPayout || {};

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
