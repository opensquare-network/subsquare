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

import { useSelector, useDispatch } from "react-redux";

export default function useRefreshMyMultisig() {
  const chain = useChain();
  const signerAccount = useSignerAccount();
  const dispatch = useDispatch();
  const address = useRealAddress();
  const myMultisigs = useSelector(myMultisigsSelector);
  const { page = 1 } = myMultisigs || {};

  const refreshMyMultisig = useCallback(() => {
    if (signerAccount?.multisig) {
      fetchMultisigList10Times(dispatch, chain, address, page);
      fetchMultisigsCount10Times(dispatch, chain, address);
    }
  }, [signerAccount?.multisig, dispatch, chain, address, page]);

  return {
    refreshMyMultisig,
  };
}

const DEFAULT_TOAST_CONTENT =
  "Multisig transaction submitted and other signatories will see it on subsquare soon.";

export function useSmartTxToast() {
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();

  const smartToastAtInBlock = useCallback(
    (content = "") => {
      if (!content) {
        return;
      }
      if (signerAccount?.multisig) {
        dispatch(newSuccessToast(DEFAULT_TOAST_CONTENT));
      } else {
        dispatch(newSuccessToast(content));
      }
    },
    [signerAccount?.multisig, dispatch],
  );

  return {
    smartToastAtInBlock,
  };
}
