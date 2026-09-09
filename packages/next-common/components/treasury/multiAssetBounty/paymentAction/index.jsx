import PrimaryButton from "next-common/lib/button/primary";
import { useOnchainData } from "next-common/context/post";
import useMultiAssetBountyStatus from "../useMultiAssetBountyStatus";
import usePaymentActionPopup from "./usePaymentActionPopup";

// A bounty that has an in-flight payment attempt sits in one of the
// `*Attempted` on-chain states:
//   FundingAttempted / RefundAttempted / PayoutAttempted
// check_status resolves an initiated (Attempted/Pending) payment, while
// retry_payment re-initiates a failed one. Both are permissionless (any
// signed account), so this is a plain button without a role menu.
const PAYMENT_ATTEMPT_STATUSES = [
  "FundingAttempted",
  "RefundAttempted",
  "PayoutAttempted",
];

function resolvePaymentAction(status) {
  if (!PAYMENT_ATTEMPT_STATUSES.includes(status?.type)) {
    return null;
  }

  const paymentStatus = status?.value?.payment_status?.type;
  if (paymentStatus === "Failed" || paymentStatus === "Pending") {
    return { method: "retryPayment", title: "Retry Payment" };
  }
  if (paymentStatus === "Attempted") {
    return { method: "checkStatus", title: "Check Status" };
  }

  return null;
}

export default function MultiAssetBountyPaymentAction() {
  const { bountyIndex } = useOnchainData();
  const status = useMultiAssetBountyStatus(bountyIndex);
  const action = resolvePaymentAction(status);
  const { showPopup, popup } = usePaymentActionPopup(action);

  if (!action) {
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
