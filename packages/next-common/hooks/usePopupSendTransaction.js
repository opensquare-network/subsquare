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
  newToastId,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";
import { usePopupOnClose } from "next-common/context/popup";
import { noop } from "lodash-es";

export async function usePopupSendTransaction() {
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
      dispatch(
        newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
      );

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
        dispatch(removeToast(toastId));
        dispatch(newErrorToast(e.message));
      };

      setIsLoading(true);

      try {
        const isMimirWallet = signerAccount?.meta?.source === WalletTypes.MIMIR;
        if (isMimirWallet) {
          const handled = await maybeSendMimirTx({
            tx,
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

        const isSignetWallet =
          signerAccount?.meta?.source === WalletTypes.SIGNET;
        if (isSignetWallet) {
          const handled = await maybeSendSignetTx({
            tx,
            onSubmitted: _onSubmitted,
            onError,
          });
          if (handled) {
            return;
          }
        }

        let shouldSendEvmTx =
          (isEvmChain() || isMixedChain()) &&
          signerAccount?.meta?.source === WalletTypes.METAMASK;

        shouldSendEvmTx =
          shouldSendEvmTx ||
          (isMixedChain() &&
            isEthereumAddress(tryConvertToEvmAddress(signerAccount?.address)) &&
            signerAccount?.meta?.source === WalletTypes.TALISMAN);

        if (shouldSendEvmTx) {
          await sendEvmTx({
            data: tx.inner.toU8a(),
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
