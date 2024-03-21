import { emptyFunction } from ".";
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
  setLoading = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  section: sectionName,
  method: methodName,
  totalSteps,
  noWaitForFinalized,
  unsub = emptyFunction,
}) {
  let blockHash = null;

  return ({ events = [], status }) => {
    if (status.isFinalized) {
      dispatch(removeToast(toastId));
      onFinalized(blockHash);
      unsub();
    }

    if (handleExtrinsicFailure(dispatch, status, events, toastId)) {
      unsub();
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

      for (const event of events) {
        const { section, method, data } = event.event;
        if (section !== sectionName || method !== methodName) {
          continue;
        }
        const eventData = data.toJSON();
        onInBlock(eventData, blockHash);
        break;
      }

      if (!sectionName || !methodName) {
        onInBlock(undefined, blockHash);
      }
    }
  };
}

export async function defaultSendTx({
  tx,
  dispatch,
  setLoading = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
  signerAccount,
  section: sectionName,
  method: methodName,
}) {
  const signerAddress = signerAccount?.address;

  const noWaitForFinalized = onFinalized === emptyFunction;
  const totalSteps = noWaitForFinalized ? 2 : 3;

  const toastId = newToastId();
  dispatch(
    newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
  );

  try {
    setLoading(true);

    const api = getLatestApi();
    const account = await api.query.system.account(signerAddress);

    const unsub = await tx.signAndSend(
      signerAddress,
      { nonce: account.nonce },
      createSendTxEventHandler({
        toastId,
        dispatch,
        setLoading,
        onFinalized,
        onInBlock,
        section: sectionName,
        method: methodName,
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
  setLoading = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
  signerAccount,
  section: sectionName,
  method: methodName,
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
      section: sectionName,
      method: methodName,
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

  await defaultSendTx({
    tx,
    dispatch,
    setLoading,
    onInBlock,
    onSubmitted,
    onFinalized,
    onClose,
    signerAccount,
    section: sectionName,
    method: methodName,
  });
}

export function wrapWithProxy(api, tx, proxyAddress) {
  return api.tx.proxy.proxy(proxyAddress, null, tx);
}
