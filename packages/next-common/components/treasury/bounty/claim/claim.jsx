import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

const ClaimPopup = dynamicPopup(() => import("./popup"));

export default function Claim() {
  const onChain = useOnchainData();
  const { bountyIndex } = onChain;
  const [showPopup, setShowPopup] = useState(false);
  const chainHeight = useAhmLatestHeight();
  const status = onChain.meta?.status;

  if (!status || !status?.pendingPayout) {
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
        <ClaimPopup
          bountyIndex={bountyIndex}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
