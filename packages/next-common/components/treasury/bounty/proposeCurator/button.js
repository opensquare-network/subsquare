import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import { has } from "lodash-es";
import BountyProposeCuratorPopup from "./popup";
import { useOnchainData } from "next-common/context/post";

export default function BountyProposeCuratorButton() {
  const [showPopup, setShowPopup] = useState(false);
  const { meta } = useOnchainData();
  const status = meta?.status || {};

  if (!has(status, "funded")) {
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
