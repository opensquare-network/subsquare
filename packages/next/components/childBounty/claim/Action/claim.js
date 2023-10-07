import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import ClaimedInfo from "./ClaimedInfo";
import { childBountyStatusSelector } from "next-common/store/reducers/childBountySlice";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

const Popup = dynamic(() => import("../popup"), {
  ssr: false,
});

export default function Claim() {
  const onChain = useOnchainData();
  const [showPopup, setShowPopup] = useState(false);
  const chainHeight = useSelector(chainOrScanHeightSelector);

  const status = useSelector(childBountyStatusSelector);
  if (!status || !status.pendingPayout) {
    return <ClaimedInfo />;
  }

  const { unlockAt } = status.pendingPayout || {};

  return (
    <>
      <PrimaryButton
        isFill
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
