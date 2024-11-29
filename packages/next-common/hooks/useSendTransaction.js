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
  sendHydraDXMultiFeeEvmTx,
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
import { noop } from "lodash-es";
import { useSignetSdk } from "next-common/context/signet";
import { isEmptyFunc } from "next-common/utils/isEmptyFunc";
import isHydradx from "next-common/utils/isHydradx";
import { HydradxAssets } from "next-common/utils/hydradx";

function shouldSendEvmTx(signerAccount) {
  const isWalletMetamask = signerAccount?.meta?.source === WalletTypes.METAMASK;
  if ((isEvmChain() || isMixedChain()) && isWalletMetamask) {
    return true;
  }
  const isEvmAddr = isEthereumAddress(
    tryConvertToEvmAddress(signerAccount?.address),
  );
  const isWalletTalisman = signerAccount?.meta?.source === WalletTypes.TALISMAN;
  return isMixedChain() && isEvmAddr && isWalletTalisman;
}

function shouldSendSignetTx(signerAccount) {
  return signerAccount?.meta?.source === WalletTypes.SIGNET;
}

function shouldSendMimirTx(signerAccount) {
  return signerAccount?.meta?.source === WalletTypes.MIMIR;
}

async function shouldSendHydraDXMultiFeeTx(api, signerAccount) {
  // Multi fee tx support on HydraDX chain only
  if (!isHydradx()) {
    return false;
  }
  // Make sure the chain has the multi fee tx feature
  if (!api.query.multiTransactionPayment) {
    return false;
  }

  const accountCurrency =
    await api.query.multiTransactionPayment.accountCurrencyMap(
      signerAccount?.address,
    );
  // If fee asset is not set, it use HDX as default
  if (accountCurrency.isNone) {
    return true;
  }

  // If fee asset is not WETH, it should use multi fee tx
  const currencyId = accountCurrency.unwrap();
  return currencyId.toNumber() !== HydradxAssets.WETH.assetId;
}

export function useSendTransaction() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const { sdk: signetSdk } = useSignetSdk();

  const sendTxFunc = useCallback(
    async ({
      api,
      tx,
      onInBlock = noop,
      onSubmitted = noop,
      onFinalized = noop,
      onCancelled = noop,
    }) => {
      const noWaitForFinalized = isEmptyFunc(onFinalized);
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
        onSubmitted();
      };

      const _onInBlock = (data) => {
        setIsSubmitting(false);
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
        setIsSubmitting(false);
        dispatch(removeToast(toastId));
        if (e.message === "Cancelled") {
          dispatch(newWarningToast(e.message));
          onCancelled();
        } else {
          dispatch(newErrorToast(e.message));
        }
      };

      setIsSubmitting(true);

      try {
        if (shouldSendMimirTx(signerAccount)) {
          const handled = await maybeSendMimirTx({
            api,
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

        if (shouldSendSignetTx(signerAccount)) {
          const handled = await maybeSendSignetTx({
            sdk: signetSdk,
            tx,
            onStarted: () => {
              dispatch(newPendingToast(toastId, "Waiting for signing..."));
            },
            onSubmitted: () => {
              dispatch(newSuccessToast("Multisig transaction submitted"));
              setIsSubmitting(false);
              onSubmitted();
            },
            onEnded: () => {
              dispatch(removeToast(toastId));
              setIsSubmitting(false);
            },
            onError,
          });
          if (handled) {
            return;
          }
        }

        if (shouldSendEvmTx(signerAccount)) {
          const hydradxMultiFee = await shouldSendHydraDXMultiFeeTx(
            api,
            signerAccount,
          );
          if (hydradxMultiFee) {
            await sendHydraDXMultiFeeEvmTx({
              api,
              data: tx.inner.toU8a(),
              onStarted,
              onInBlock: _onInBlock,
              onSubmitted: _onSubmitted,
              onFinalized: _onFinalized,
              onError,
              signerAddress: signerAccount?.address,
            });
            return;
          }

          await sendEvmTx({
            api,
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
        setIsSubmitting(false);
      }
    },
    [dispatch, signerAccount, signetSdk],
  );

  return {
    sendTxFunc,
    isSubmitting,
  };
}
