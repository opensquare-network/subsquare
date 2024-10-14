import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubStorage from "next-common/hooks/common/useSubStorage";

const Popup = dynamicPopup(() => import("./popup"));

export default function Claim() {
  const onChain = useOnchainData();
  const [showPopup, setShowPopup] = useState(false);
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const { parentBountyId, index } = useOnchainData();

  const { loading, result: onChainStorage } = useSubStorage(
    "childBounties",
    "childBounties",
    [parentBountyId, index],
  );
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
        <Popup childBounty={onChain} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
