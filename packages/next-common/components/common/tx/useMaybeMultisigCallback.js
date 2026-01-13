import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useRefreshMyMultisig from "./useRefreshMyMultisig";

export function useMaybeMultisigCallback({ onInBlock, onFinalized }) {
  const signerAccount = useSignerAccount();
  const multisigOnInBlock = useMultisigOnInBlock(onInBlock);
  const multisigOnFinalized = useMultisigOnFinalized(onFinalized);
  if (signerAccount?.multisig) {
    return {
      onInBlock: multisigOnInBlock,
      onFinalized: multisigOnFinalized,
    };
  }

  return {
    onInBlock,
    onFinalized,
  };
}

function useMultisigOnInBlock(originalCallback) {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(
      newSuccessToast(
        "Multisig transaction submitted and other signatories will see it on subsquare soon.",
      ),
    );
    originalCallback?.();
  }, [dispatch, originalCallback]);
}

function useMultisigOnFinalized(originalCallback) {
  const dispatch = useDispatch();
  const { refreshMyMultisig } = useRefreshMyMultisig();

  return useCallback(() => {
    dispatch(newSuccessToast("Multisig status will be updated in seconds."));
    refreshMyMultisig();
    originalCallback?.();
  }, [dispatch, originalCallback, refreshMyMultisig]);
}
