import { normalizeAddress } from "../address";
import ChainTypes from "../consts/chainTypes";
import WalletTypes from "../consts/walletTypes";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  newWarningToast,
  removeToast,
} from "next-common/store/reducers/toastSlice";
import { getSignetSdk } from "next-common/context/signet";
import { noop } from "lodash-es";

export function normalizedSignetAccount(acc) {
  return {
    name: acc.name,
    address: normalizeAddress(acc.address),
    type: ChainTypes.SUBSTRATE,
    meta: {
      source: WalletTypes.SIGNET,
      name: acc.name,
    },
  };
}

export async function maybeSendSignetTx({
  tx,
  dispatch,
  setLoading = noop,
  onClose = noop,
}) {
  const toastId = newToastId();
  dispatch(newPendingToast(toastId, "Waiting for signing..."));

  try {
    setLoading(true);

    const sdk = getSignetSdk();
    if (!sdk) {
      throw new Error("Signet SDK is initialized.");
    }
    const res = await sdk.send(tx.method.toHex());

    if (res.ok) {
      dispatch(newSuccessToast("Multisig transaction submitted"));
      onClose();
    } else {
      if (res.error !== "Cancelled") {
        dispatch(newErrorToast(res.error));
      }
    }

    return true;
  } catch (e) {
    if (e.message === "Cancelled") {
      dispatch(newWarningToast(e.message));
    } else {
      dispatch(newErrorToast(e.message));
    }
  } finally {
    dispatch(removeToast(toastId));
    setLoading(false);
  }

  return true;
}
