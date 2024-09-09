import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { useSelector } from "react-redux";
import ClaimedInfo from "./ClaimedInfo";
import { childBountyStatusSelector } from "next-common/store/reducers/childBountySlice";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ClaimPopup = dynamicPopup(() => import("./popup"));

export default function Claim() {
  const onChain = useOnchainData();
  const [showPopup, setShowPopup] = useState(false);
  const chainHeight = useSelector(chainOrScanHeightSelector);

  // TODO: fetch status(context)
  const status = useSelector(childBountyStatusSelector);
  // TODO: judge status
  if (!status) {
    return <ClaimedInfo />;
  }

  // TODO: unlockAt
  const { unlockAt } = status.pendingPayout || {};

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
        <ClaimPopup bounty={onChain} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
