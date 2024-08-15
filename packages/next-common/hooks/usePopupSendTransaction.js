import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import WalletTypes from "next-common/utils/consts/walletTypes";
import isEvmChain from "next-common/utils/isEvmChain";
import isMixedChain from "next-common/utils/isMixedChain";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import {
  maybeSendMimirTx,
  maybeSendSignetTx,
  sendEvmTx,
  sendSubstrateTx,
} from "next-common/utils/sendTransaction";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  newWarningToast,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";
import { usePopupOnClose } from "next-common/context/popup";
import { noop } from "lodash-es";

function isShouldSendEvmTx(signerAccount) {
  if (
    (isEvmChain() || isMixedChain()) &&
    signerAccount?.meta?.source === WalletTypes.METAMASK
  ) {
    return true;
  }

  if (
    isMixedChain() &&
    isEthereumAddress(tryConvertToEvmAddress(signerAccount?.address)) &&
    signerAccount?.meta?.source === WalletTypes.TALISMAN
  ) {
    return true;
  }

  return false;
}

function isShouldSendSignetTx(signerAccount) {
  return signerAccount?.meta?.source === WalletTypes.SIGNET;
}

function isShouldSendMimirTx(signerAccount) {
  return signerAccount?.meta?.source === WalletTypes.MIMIR;
}

export function usePopupSendTransaction() {
  const onClose = usePopupOnClose();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();

  const sendTx = useCallback(
    async ({
      api,
      tx,
      onInBlock = noop,
      onSubmitted = noop,
      onFinalized = noop,
    }) => {
      const noWaitForFinalized = onFinalized === noop;
      const totalSteps = noWaitForFinalized ? 2 : 3;
      const toastId = newToastId();

      const onStarted = () => {
        dispatch(
          newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
        );
      };

      const _onSubmitted = () => {
        dispatch(
          updatePendingToast(
            toastId,
            `(2/${totalSteps}) Submitted, waiting for wrapping...`,
          ),
        );
        onClose();
        onSubmitted();
      };

      const _onInBlock = (data) => {
        setIsLoading(false);
        if (noWaitForFinalized) {
          dispatch(removeToast(toastId));
        } else {
          dispatch(
            updatePendingToast(
              toastId,
              `(3/${totalSteps}) Inblock, waiting for finalization...`,
            ),
          );
        }
        onInBlock(data);
      };

      const _onFinalized = (data) => {
        dispatch(removeToast(toastId));
        onFinalized(data);
      };

      const onError = (e) => {
        setIsLoading(false);
        dispatch(removeToast(toastId));
        if (e.message === "Cancelled") {
          dispatch(newWarningToast(e.message));
        } else {
          dispatch(newErrorToast(e.message));
        }
      };

      setIsLoading(true);

      try {
        if (isShouldSendMimirTx(signerAccount)) {
          const handled = await maybeSendMimirTx({
            tx,
            onStarted,
            onInBlock: _onInBlock,
            onSubmitted: _onSubmitted,
            onFinalized: _onFinalized,
            onError,
            signerAddress: signerAccount?.address,
          });
          if (handled) {
            return;
          }
        }

        if (isShouldSendSignetTx(signerAccount)) {
          const handled = await maybeSendSignetTx({
            tx,
            onStarted: () => {
              dispatch(newPendingToast(toastId, "Waiting for signing..."));
            },
            onSubmitted: () => {
              dispatch(newSuccessToast("Multisig transaction submitted"));
              setIsLoading(false);
              onClose();
              onSubmitted();
            },
            onEnded: () => {
              dispatch(removeToast(toastId));
              setIsLoading(false);
            },
            onError,
          });
          if (handled) {
            return;
          }
        }

        if (isShouldSendEvmTx(signerAccount)) {
          await sendEvmTx({
            data: tx.inner.toU8a(),
            onStarted,
            onInBlock: _onInBlock,
            onSubmitted: _onSubmitted,
            onError,
            signerAddress: signerAccount?.address,
          });
          return;
        }

        await sendSubstrateTx({
          api,
          tx,
          onStarted,
          onInBlock: _onInBlock,
          onSubmitted: _onSubmitted,
          onFinalized: _onFinalized,
          onError,
          signerAddress: signerAccount?.address,
        });
      } catch (e) {
        dispatch(newErrorToast(e.message));
        setIsLoading(false);
      }
    },
    [dispatch, signerAccount, onClose],
  );

  return {
    sendTx,
    isLoading,
  };
}
