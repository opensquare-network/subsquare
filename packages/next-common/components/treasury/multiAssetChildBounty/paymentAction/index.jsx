import PrimaryButton from "next-common/lib/button/primary";
import { useOnchainData, usePostState } from "next-common/context/post";
import usePaymentActionPopup from "./usePaymentActionPopup";

const PAYMENT_ACTIONS = {
  attempted: {
    method: "checkStatus",
    title: "Check Status",
  },
  failed: {
    method: "retryPayment",
    title: "Retry Payment",
  },
  pending: {
    method: "retryPayment",
    title: "Retry Payment",
  },
};

export default function MultiAssetChildBountyPaymentAction() {
  const state = usePostState();
  const { lastPaymentStatus, meta } = useOnchainData();
  const action = PAYMENT_ACTIONS[lastPaymentStatus];
  const isPayoutAttempted = Boolean(meta?.status?.payoutAttempted);
  const { showPopup, popup } = usePaymentActionPopup(action);

  if (state !== "Awarded" || !isPayoutAttempted || !action) {
    return null;
  }

  return (
    <>
      <PrimaryButton className="w-full" onClick={showPopup}>
        {action.title}
      </PrimaryButton>
      {popup}
    </>
  );
}
