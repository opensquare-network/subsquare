import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import BountyProposeCuratorPopup from "./popup";
import { useOnchainData } from "next-common/context/post";
import { useBountyStatus } from "../useBountyStatus";

export default function BountyProposeCuratorButton() {
  const [showPopup, setShowPopup] = useState(false);
  const { bountyIndex } = useOnchainData();

  const status = useBountyStatus(bountyIndex);
  if (!status?.isFunded) {
    return null;
  }

  return (
    <>
      <PrimaryButton className="w-full" onClick={() => setShowPopup(true)}>
        Propose Curator
      </PrimaryButton>

      {showPopup && (
        <BountyProposeCuratorPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
