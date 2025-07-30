import { noop } from "lodash-es";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useRefreshMyMultisig from "./useRefreshMyMultisig";

export default function useWraperTxCallback() {
  const signerAccount = useSignerAccount();

  return useCallback(
    (normalCallback = noop, multisigCallback = noop) => {
      if (signerAccount?.multisig) {
        return multisigCallback;
      }
      return normalCallback;
    },
    [signerAccount?.multisig],
  );
}

export function useMultisigCallback() {
  return {
    onInBlock: useMultisigOnInBlock(),
    onFinalized: noop,
  };
}

export function useMultisigOnInBlock() {
  const dispatch = useDispatch();
  const { refreshMyMultisig } = useRefreshMyMultisig();
  return () => {
    dispatch(
      newSuccessToast(
        "Multisig transaction submitted and other signatories will see it on subsquare soon.",
      ),
    );
    refreshMyMultisig();
  };
}
