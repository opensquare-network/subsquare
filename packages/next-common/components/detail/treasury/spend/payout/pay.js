import { useOnchainData, usePostState } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useMemo, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
import { has } from "lodash-es";
import { cn } from "next-common/utils";
import useChainOrScanHeight from "next-common/hooks/height";

const Popup = dynamicPopup(() => import("./popup"));

export default function TreasurySpendPay() {
  const [showPopup, setShowPopup] = useState(false);
  const state = usePostState();

  if (["Paid", "Processed"].includes(state)) {
    return null;
  }

  return (
    <>
      <PayoutContent setShowPopup={setShowPopup} />
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </>
  );
}

function PayoutContent({ setShowPopup }) {
  const { index, meta } = useOnchainData() || {};
  const latestHeight = useChainOrScanHeight();
  const onchainStatus = useSubTreasurySpend(index);
  const { expireAt } = meta || {};
  const disabled = useMemo(() => {
    return !has(onchainStatus?.status, "pending");
  }, [onchainStatus]);

  if (expireAt && latestHeight >= expireAt) {
    return (
      <div className="text14Medium text-textSecondary">
        This treasury spend is expired,{" "}
        <span
          className={cn(
            "text-theme500 cursor-pointer font-bold",
            disabled && "text-theme300 cursor-not-allowed",
          )}
          onClick={() => setShowPopup(true)}
        >
          still payout.
        </span>
      </div>
    );
  }

  return (
    <PrimaryButton
      className="w-full"
      disabled={disabled}
      onClick={() => setShowPopup(true)}
    >
      Payout
    </PrimaryButton>
  );
}
