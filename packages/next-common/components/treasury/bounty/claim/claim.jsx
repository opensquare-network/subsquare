import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import useChainOrScanHeight from "next-common/hooks/height";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubStorage from "next-common/hooks/common/useSubStorage";

const ClaimPopup = dynamicPopup(() => import("./popup"));

export default function Claim() {
  const onChain = useOnchainData();
  const { bountyIndex } = onChain;
  const { loading, result: onChainStorage } = useSubStorage(
    "bounties",
    "bounties",
    [bountyIndex],
  );

  const [showPopup, setShowPopup] = useState(false);
  const chainHeight = useChainOrScanHeight();

  if (loading || !onChainStorage?.isSome) {
    return null;
  }

  const { status } = onChainStorage.toJSON();
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
