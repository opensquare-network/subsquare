import { isNil } from "lodash-es";
import { getPayoutSpendStatus } from "./chainData";

// @polkadot/api camelCase call names
const ACTION_CALLS = {
  Pending: "payout",
  Failed: "payout",
  Attempted: "checkStatus",
};

export function getPayoutActionCall(status) {
  const normalized = getPayoutSpendStatus(status);
  return normalized ? ACTION_CALLS[normalized] : null;
}

export function getPayoutActionTx(api, treasuryPallet, status, index) {
  const call = getPayoutActionCall(status);
  if (!api || !treasuryPallet || !call || isNil(index)) {
    return null;
  }

  const txFunc = api.tx?.[treasuryPallet]?.[call];
  if (typeof txFunc !== "function") {
    return null;
  }

  return txFunc(index);
}
