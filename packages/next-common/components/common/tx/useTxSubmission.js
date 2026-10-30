import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { noop } from "lodash-es";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { wrapTransaction } from "next-common/utils/sendTransaction";
import { useContextApi } from "next-common/context/api";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";
import { useMaybeMultisigCallback } from "./useMaybeMultisigCallback";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";
import WalletTypes from "next-common/utils/consts/walletTypes";

export default function useTxSubmission({
  api,
  getTxFunc = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onCancelled = noop,
  onTxError = noop,
  onTxStart = noop,
}) {
  const dispatch = useDispatch();
  const defaultApi = useContextApi();
  const apiToUse = api || defaultApi;
  const signerAccount = useSignerAccount();
  const isWatchOnly = useIsWatchOnly();
  const { sendTxFunc, isSubmitting } = useSendTransaction();
  const {
    onInBlock: maybeMultisigOnInBlock,
    onFinalized: maybeMultisigOnFinalized,
  } = useMaybeMultisigCallback({ onInBlock, onFinalized });
  const [isWrapping, setIsWrapping] = useState(false);
  const [isSequencing, setIsSequencing] = useState(false);
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  const getTx = useCallback(
    async (...args) => {
      let tx = null;
      try {
        tx = await getTxFunc(...args);
      } catch (e) {
        dispatch(newErrorToast(e.message));
        return;
      }

      if (!tx) {
        return;
      }

      if (Array.isArray(tx)) {
        return Promise.all(
          tx.map((item) => wrapTransaction(apiToUse, item, signerAccount)),
        );
      }

      tx = await wrapTransaction(apiToUse, tx, signerAccount);
      return tx;
    },
    [getTxFunc, apiToUse, signerAccount, dispatch],
  );

  // A getTxFunc may return several transactions, e.g. when a batch has to be
  // split because of the block weight limit. Sign and send them one by one and
  // wait for each one to be included (so the next one reads the updated nonce).
  const sendTxsSequentially = useCallback(
    async (txs) => {
      // Signet only submits the transaction to the multisig service, it never
      // reports an in-block event.
      const waitForInBlock =
        signerAccount?.meta?.source !== WalletTypes.SIGNET;

      for (const tx of txs) {
        // Stop prompting for the next signature once the popup is closed.
        if (unmountedRef.current) {
          return;
        }

        await new Promise((resolve, reject) => {
          let settled = false;
          const finish = () => {
            if (!settled) {
              settled = true;
              resolve();
            }
          };
          const fail = (e) => {
            if (!settled) {
              settled = true;
              reject(e);
            }
          };

          sendTxFunc({
            api: apiToUse,
            tx,
            onTxStart,
            onInBlock: (data) => {
              maybeMultisigOnInBlock(data);
              finish();
            },
            onFinalized: maybeMultisigOnFinalized,
            onSubmitted: waitForInBlock ? noop : finish,
            onCancelled: () => {
              onCancelled();
              fail(new Error("Cancelled"));
            },
            onTxError: (e) => {
              onTxError(e);
              fail(e);
            },
          });
        });
      }
    },
    [
      apiToUse,
      sendTxFunc,
      signerAccount,
      onTxStart,
      maybeMultisigOnInBlock,
      maybeMultisigOnFinalized,
      onCancelled,
      onTxError,
    ],
  );

  const doSubmit = useCallback(
    async (...args) => {
      if (isWatchOnly) {
        dispatch(newErrorToast(WATCH_ONLY_TOOLTIP_TEXT));
        return;
      }

      if (!apiToUse) {
        dispatch(newErrorToast("Chain RPC is not connected yet"));
        return;
      }

      if (!signerAccount) {
        dispatch(newErrorToast("Signer account is not specified"));
        return;
      }

      setIsWrapping(true);
      let tx;
      try {
        tx = await getTx(...args);
      } finally {
        setIsWrapping(false);
      }

      if (!tx) {
        return;
      }

      if (Array.isArray(tx)) {
        setIsSequencing(true);
        try {
          await sendTxsSequentially(tx);
          onSubmitted();
        } catch {
          // sendTxFunc already shows the error toast.
        } finally {
          setIsSequencing(false);
        }
        return;
      }

      await sendTxFunc({
        api: apiToUse,
        tx,
        onTxStart,
        onSubmitted,
        onInBlock: maybeMultisigOnInBlock,
        onFinalized: maybeMultisigOnFinalized,
        onCancelled,
        onTxError,
      });
    },
    [
      apiToUse,
      dispatch,
      isWatchOnly,
      signerAccount,
      getTx,
      sendTxFunc,
      sendTxsSequentially,
      onTxStart,
      onSubmitted,
      maybeMultisigOnInBlock,
      maybeMultisigOnFinalized,
      onCancelled,
      onTxError,
    ],
  );

  return {
    isWrapping,
    isSubmitting: isSubmitting || isSequencing,
    doSubmit,
  };
}
