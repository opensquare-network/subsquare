import { useOnchainData, usePostState } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { useRef, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
import { isNil } from "lodash-es";
import { cn } from "next-common/utils";
import { noop } from "@polkadot/util";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import Tooltip from "next-common/components/tooltip";
import { useTreasuryPallet } from "next-common/context/treasury";

const Popup = dynamicPopup(() => import("./popup"));

export default function TreasurySpendPay() {
  const [showPopup, setShowPopup] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutDone, setPayoutDone] = useState(false);
  const flowStartedRef = useRef(false);
  const state = usePostState();
  const pallet = useTreasuryPallet();
  const { index } = useOnchainData() || {};

  if (["Paid", "Processed"].includes(state)) {
    return null;
  }

  const onOpen = () => {
    setShowPopup(true);
  };

  const onClose = () => {
    setShowPopup(false);
    if (!flowStartedRef.current) {
      setPayoutLoading(false);
    }
  };

  const stopPayoutLoading = () => {
    flowStartedRef.current = false;
    setPayoutLoading(false);
  };

  const onPayoutInBlock = ({ events = [] } = {}) => {
    stopPayoutLoading();

    // `onInBlock` also fires when a multisig approval is included without
    // executing the payout, so only react to the actual Paid event.
    const paid = events.some(
      ({ event }) =>
        event.section === pallet &&
        event.method === "Paid" &&
        Number(event.data[0]?.toString()) === Number(index),
    );

    if (paid) {
      // The spend is removed from on-chain storage in this block, but it takes
      // a moment for the subscription (and the scanner) to reflect that.
      // Disable the button right away so it can not be clicked again after a
      // successful payout.
      setPayoutDone(true);
    }
  };

  return (
    <>
      <ExpiredGuard onOpen={onOpen} payoutDone={payoutDone}>
        <PayoutContent
          onOpen={onOpen}
          payoutLoading={payoutLoading}
          payoutDone={payoutDone}
        />
      </ExpiredGuard>
      {showPopup && (
        <Popup
          onClose={onClose}
          onTxStart={() => {
            flowStartedRef.current = true;
            setPayoutLoading(true);
          }}
          onInBlock={onPayoutInBlock}
          onTxError={stopPayoutLoading}
          onCancelled={stopPayoutLoading}
        />
      )}
    </>
  );
}

function ExpiredGuard({ children, onOpen = noop, payoutDone = false }) {
  const latestHeight = useAhmLatestHeight();
  const { meta } = useOnchainData() || {};
  const { expireAt } = meta || {};

  if (expireAt && latestHeight >= expireAt) {
    if (payoutDone) {
      return (
        <div className="text14Medium text-textSecondary">
          This treasury spend has been paid.
        </div>
      );
    }

    return (
      <div className="text14Medium text-textSecondary">
        This treasury spend is expired,{" "}
        <span
          className={cn("text-theme500 cursor-pointer font-bold")}
          onClick={onOpen}
        >
          still payout.
        </span>
      </div>
    );
  } else {
    return children;
  }
}

function PayoutContent({
  onOpen = noop,
  payoutLoading = false,
  payoutDone = false,
}) {
  const { index, meta } = useOnchainData() || {};
  const latestHeight = useAhmLatestHeight();
  const { spend: onchainStatus, loading } = useSubTreasurySpend(index);
  const { validFrom } = meta || {};

  const isQueryDone = !isNil(onchainStatus) && !loading;

  let tooltipContent;
  let isDisabled = !isQueryDone;

  if (payoutDone) {
    isDisabled = true;
    tooltipContent = "This treasury spend has been paid";
  } else if (isNil(onchainStatus) && !loading) {
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
    onOpen();
  };

  return (
    <Tooltip content={tooltipContent}>
      <PrimaryButton
        className="w-full"
        loading={loading || payoutLoading}
        disabled={isDisabled}
        onClick={onAttemptPayout}
      >
        Payout
      </PrimaryButton>
    </Tooltip>
  );
}
