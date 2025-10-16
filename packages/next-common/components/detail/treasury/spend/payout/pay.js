import { useOnchainData, usePostState } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
import { isNil } from "lodash-es";
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
      <ExpiredGuard setShowPopup={setShowPopup}>
        <PayoutContent setShowPopup={setShowPopup} />
      </ExpiredGuard>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </>
  );
}

function ExpiredGuard({ children, setShowPopup = noop }) {
  const latestHeight = useAhmLatestHeight();
  const { meta } = useOnchainData() || {};
  const { expireAt } = meta || {};

  const onStillPayout = () => {
    setShowPopup(true);
  };

  if (expireAt && latestHeight >= expireAt) {
    return (
      <div className="text14Medium text-textSecondary">
        This treasury spend is expired,{" "}
        <span
          className={cn("text-theme500 cursor-pointer font-bold")}
          onClick={onStillPayout}
        >
          still payout.
        </span>
      </div>
    );
  } else {
    return children;
  }
}

function PayoutContent({ setShowPopup = noop }) {
  const { index, meta } = useOnchainData() || {};
  const latestHeight = useAhmLatestHeight();
  const { spend: onchainStatus, loading } = useSubTreasurySpend(index);
  const { validFrom } = meta || {};

  const isQueryDone = !isNil(onchainStatus) && !loading;

  let tooltipContent;
  let isDisabled = !isQueryDone;

  if (isNil(onchainStatus) && !loading) {
    isDisabled = true;
    tooltipContent = "Can not find on chain info";
  } else if (isQueryDone && latestHeight < validFrom) {
    isDisabled = true;
    tooltipContent = "This spend is still not valid";
  }

  const onAttemptPayout = () => {
    if (isDisabled) {
      return;
    }
    setShowPopup(true);
  };

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
