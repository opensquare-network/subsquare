import { noop } from "@polkadot/util";
import {
  fetchMultisigList10Times,
  fetchMultisigsCount10Times,
} from "next-common/components/multisigs/common";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useChain } from "next-common/context/chain";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const DEFAULT_TOAST_CONTENT =
  "Multisig transaction submitted and other signatories will see it on subsquare soon.";

export default function useMultisigSubmited({
  toastContent = DEFAULT_TOAST_CONTENT,
  onInBlock = noop,
} = {}) {
  const chain = useChain();
  const signerAccount = useSignerAccount();
  const dispatch = useDispatch();
  const address = useRealAddress();
  const myMultisigs = useSelector(myMultisigsSelector);
  const { page = 1 } = myMultisigs || {};

  const onMultisigInBlock = useCallback(() => {
    if (signerAccount?.multisig && toastContent) {
      dispatch(newSuccessToast(toastContent));
    }
  }, [signerAccount?.multisig, toastContent, dispatch]);

  const wrapperMultisigOnInBlock = useCallback(
    (data) => {
      if (signerAccount?.multisig) {
        onMultisigInBlock(data);
      } else {
        onInBlock?.(data);
      }
    },
    [signerAccount?.multisig, onMultisigInBlock, onInBlock],
  );

  const onMultisigFinalized = useCallback(() => {
    if (signerAccount?.multisig) {
      fetchMultisigList10Times(dispatch, chain, address, page);
      fetchMultisigsCount10Times(dispatch, chain, address);
    }
  }, [signerAccount?.multisig, dispatch, chain, address, page]);

  return {
    onMultisigInBlock,
    onMultisigFinalized,
    wrapperMultisigOnInBlock,
  };
}
