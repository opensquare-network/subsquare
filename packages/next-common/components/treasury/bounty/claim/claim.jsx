import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import { useBountyStatus } from "next-common/components/treasury/bounty/useBountyStatus";

const ClaimPopup = dynamicPopup(() => import("./popup"));

export default function Claim() {
  const onChain = useOnchainData();
  const { bountyIndex } = onChain;
  const [showPopup, setShowPopup] = useState(false);
  const status = useBountyStatus(bountyIndex);
  const chainHeight = useAhmLatestHeight();

  if (!status || !status?.isSome) {
    return null;
  }
  const jsonStatus = status?.toJSON();

  const { unlockAt } = jsonStatus?.pendingPayout || {};
  if (!unlockAt) {
    return null;
  }

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
