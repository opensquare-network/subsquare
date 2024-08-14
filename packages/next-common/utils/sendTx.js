import {
  newErrorToast,
  newPendingToast,
  newToastId,
  newWarningToast,
  removeToast,
  updatePendingToast,
} from "../store/reducers/toastSlice";
import WalletTypes from "./consts/walletTypes";
import isEvmChain from "./isEvmChain";
import { maybeSendMimirTx } from "./mimir";
import { sendEvmTx } from "./sendEvmTx";
import isMixedChain from "./isMixedChain";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { tryConvertToEvmAddress } from "./mixedChainUtil";
import { getLatestApi } from "next-common/context/api";
import { maybeSendSignetTx } from "./signet";
import { noop } from "lodash-es";

export async function getSigner(signerAddress) {
  const { web3Enable, web3FromAddress } = await import(
    "@polkadot/extension-dapp"
  );

  await web3Enable("subsquare");
  const injector = await web3FromAddress(signerAddress);
  return injector.signer;
}

export function getDispatchError(dispatchError) {
  let message = dispatchError.type;

  if (dispatchError.isModule) {
    try {
      const mod = dispatchError.asModule;
      const error = dispatchError.registry.findMetaError(mod);

      message = `${error.section}.${error.name}`;
    } catch (error) {
      // swallow
    }
  } else if (dispatchError.isToken) {
    message = `${dispatchError.type}.${dispatchError.asToken.type}`;
  }

  return message;
}

function handleExtrinsicFailure(dispatch, status, events, toastId) {
  if (!status.isInBlock && !status.isFinalized) {
    return false;
  }

  const failedEvent = events.find(
    (e) => e.event.section === "system" && e.event.method === "ExtrinsicFailed",
  );
  if (failedEvent) {
    const [dispatchError] = failedEvent.event.data;
    const message = getDispatchError(dispatchError);
    dispatch(removeToast(toastId));
    dispatch(newErrorToast(`Extrinsic failed: ${message}`));
    return true;
  }

  const proxyExecutedEvent = events.find(
    (e) => e.event.section === "proxy" && e.event.method === "ProxyExecuted",
  );
  if (proxyExecutedEvent) {
    const [result] = proxyExecutedEvent.event.data;
    if (result.isErr) {
      const message = getDispatchError(result.asErr);
      dispatch(removeToast(toastId));
      dispatch(newErrorToast(`Extrinsic failed: ${message}`));
      return true;
    }
  }

  return false;
}

export function createSendTxEventHandler({
  toastId,
  dispatch,
  setLoading = noop,
  onFinalized = noop,
  onInBlock = noop,
  totalSteps,
  noWaitForFinalized,
  unsub = noop,
}) {
  let blockHash = null;

  return ({ events = [], status }) => {
    if (status.isFinalized) {
      dispatch(removeToast(toastId));
      onFinalized(events, blockHash);
      unsub();
      return;
    }

    if (handleExtrinsicFailure(dispatch, status, events, toastId)) {
      unsub();
      return;
    }

    if (status.isInBlock) {
      setLoading(false);
      blockHash = status.asInBlock.toString();

      if (noWaitForFinalized) {
        unsub();
        dispatch(removeToast(toastId));
      } else {
        dispatch(
          updatePendingToast(
            toastId,
            `(3/${totalSteps}) Inblock, waiting for finalization...`,
          ),
        );
      }

      onInBlock(events, blockHash);
      return;
    }
  };
}

export async function sendSubstrateTx({
  api,
  tx,
  dispatch,
  setLoading = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onClose = noop,
  signerAddress,
}) {
  const noWaitForFinalized = onFinalized === noop;
  const totalSteps = noWaitForFinalized ? 2 : 3;

  const toastId = newToastId();
  dispatch(
    newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
  );

  try {
    setLoading(true);

    const account = await api.query.system.account(signerAddress);

    const unsub = await tx.signAndSend(
      signerAddress,
      {
        nonce: account.nonce,
        withSignedTransaction: true,
      },
      createSendTxEventHandler({
        toastId,
        dispatch,
        setLoading,
        onFinalized,
        onInBlock,
        totalSteps,
        noWaitForFinalized,
        unsub: () => unsub(),
      }),
    );

    dispatch(
      updatePendingToast(
        toastId,
        `(2/${totalSteps}) Submitted, waiting for wrapping...`,
      ),
    );
    onSubmitted(signerAddress);
    onClose();
  } catch (e) {
    dispatch(removeToast(toastId));
    setLoading(false);

    if (e.message === "Cancelled") {
      dispatch(newWarningToast(e.message));
    } else {
      dispatch(newErrorToast(e.message));
    }
  }
}

export async function sendTx({
  tx,
  dispatch,
  setLoading = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onClose = noop,
  signerAccount,
}) {
  const isMimirWallet = signerAccount?.meta?.source === WalletTypes.MIMIR;
  if (isMimirWallet) {
    const handled = await maybeSendMimirTx({
      tx,
      dispatch,
      setLoading,
      onInBlock,
      onSubmitted,
      onFinalized,
      onClose,
      signerAccount,
    });
    if (handled) {
      return;
    }
  }

  const isSignetWallet = signerAccount?.meta?.source === WalletTypes.SIGNET;
  if (isSignetWallet) {
    const handled = await maybeSendSignetTx({
      tx,
      dispatch,
      setLoading,
      onClose,
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
      dispatch,
      setLoading,
      onInBlock,
      onSubmitted,
      onClose,
      signerAccount,
    });
    return;
  }

  const api = getLatestApi();
  await sendSubstrateTx({
    api,
    tx,
    dispatch,
    setLoading,
    onInBlock,
    onSubmitted,
    onFinalized,
    onClose,
    signerAddress: signerAccount?.address,
  });
}

export function wrapWithProxy(api, tx, proxyAddress) {
  return api.tx.proxy.proxy(proxyAddress, null, tx);
}

export function getEventData(events, sectionName, methodName) {
  for (const event of events) {
    const { section, method, data } = event.event;
    if (section !== sectionName || method !== methodName) {
      continue;
    }
    return data.toJSON();
  }
}
