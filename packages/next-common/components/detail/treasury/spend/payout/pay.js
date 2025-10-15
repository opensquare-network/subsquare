import { useOnchainData, usePostState } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
import { has, isNil } from "lodash-es";
import { cn } from "next-common/utils";
import { noop } from "@polkadot/util";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import Tooltip from "next-common/components/tooltip";

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

function PayoutContent({ setShowPopup = noop }) {
  const { index, meta } = useOnchainData() || {};
  const latestHeight = useAhmLatestHeight();
  const { spend: onchainStatus, loading } = useSubTreasurySpend(index);
  const { expireAt, validFrom } = meta || {};

  const isReady = !isNil(onchainStatus) && !loading;

  const isNilOnChainStatus = isNil(onchainStatus) && !loading;

  let tooltipContent;
  let isDisabled = !isReady;

  if (isNilOnChainStatus) {
    isDisabled = true;
    tooltipContent = "This treasury spend is not valid.";
  } else if (has(onchainStatus?.status, "pending")) {
    isDisabled = true;
    tooltipContent = "This treasury spend is pending.";
  } else if (has(onchainStatus?.status, "failed")) {
    isDisabled = true;
    tooltipContent = "This treasury spend is failed.";
  } else if (isReady && latestHeight < validFrom) {
    isDisabled = true;
    tooltipContent = "This treasury spend cannot be paid out yet.";
  }

  const onAttemptPayout = () => {
    if (isDisabled) {
      return;
    }
    setShowPopup(true);
  };

  const onStillPayout = () => {
    if (!isReady) {
      return;
    }
    setShowPopup(true);
  };

  if (expireAt && latestHeight >= expireAt) {
    return (
      <div className="text14Medium text-textSecondary">
        This treasury spend is expired,{" "}
        <span
          className={cn(
            "text-theme500 cursor-pointer font-bold",
            !isReady && "text-theme300 cursor-not-allowed",
          )}
          onClick={onStillPayout}
        >
          still payout.
        </span>
      </div>
    );
  }

  return (
    <Tooltip content={tooltipContent}>
      <PrimaryButton
        className="w-full"
        loading={loading}
        disabled={isDisabled}
        onClick={onAttemptPayout}
      >
        Payout
      </PrimaryButton>
    </Tooltip>
  );
}
