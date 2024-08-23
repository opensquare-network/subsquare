import { useOnchainData, usePostState } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useMemo, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
import { has } from "lodash-es";

const Popup = dynamicPopup(() => import("./popup"));

export default function TreasurySpendPay() {
  const { index } = useOnchainData() || {};
  const onchainStatus = useSubTreasurySpend(index);
  const [showPopup, setShowPopup] = useState(false);
  const state = usePostState();

  const disabled = useMemo(() => {
    return !has(onchainStatus?.status, "pending");
  }, [onchainStatus]);

  if (["Paid", "Processed"].includes(state)) {
    return null;
  }

  return (
    <>
      <PrimaryButton
        className="w-full"
        disabled={disabled}
        onClick={() => setShowPopup(true)}
      >
        Payout
      </PrimaryButton>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </>
  );
}
