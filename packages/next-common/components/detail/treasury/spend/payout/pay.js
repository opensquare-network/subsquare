import { useOnchainData, usePostState } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
const Popup = dynamicPopup(() => import("./popup"));

export default function TreasurySpendPayOut() {
  const state = usePostState();
  const { index } = useOnchainData() || {};
  const onchainStatus = useSubTreasurySpend(index);
  const [showPopup, setShowPopup] = useState(false);
  if (["Paid", "Processed"].includes(state) || !onchainStatus) {
    return null;
  }

  return (
    <>
      <PrimaryButton
        className="w-full"
        disabled={false}
        onClick={() => setShowPopup(true)}
      >
        Payout
      </PrimaryButton>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </>
  );
}
