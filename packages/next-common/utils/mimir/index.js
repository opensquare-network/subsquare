import { inject, isMimirReady, MIMIR_REGEXP } from "@mimirdev/apps-inject";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  newWarningToast,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";
import { createSendTxEventHandler } from "../sendTx";
import { checkCall } from "@mimirdev/apps-sdk";
import { getLatestApi } from "next-common/context/api";
import { noop } from "lodash-es";

export async function tryInitMimir() {
  if (typeof window === "undefined") {
    return;
  }

  const openInIframe = window !== window.parent;

  if (!openInIframe) {
    return;
  }

  const origin = await isMimirReady();

  if (!origin) {
    return;
  }

  // check is mimir url
  if (!MIMIR_REGEXP.test(origin)) {
    return;
  }

  // inject to window.injectedWeb3.mimir
  inject();
  // now. you can use polkadot extension functions
}

export async function maybeSendMimirTx({
  tx,
  dispatch,
  setLoading = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onClose = noop,
  signerAccount,
}) {
  const { web3Enable, web3FromSource } = await import(
    "@polkadot/extension-dapp"
  );

  const signerAddress = signerAccount?.address;

  await web3Enable("subsquare");
  const injected = await web3FromSource("mimir");

  const isMimir = injected.name === "mimir";
  if (!isMimir) {
    return false;
  }

  const noWaitForFinalized = onFinalized === noop;
  const totalSteps = noWaitForFinalized ? 2 : 3;

  const toastId = newToastId();
  dispatch(
    newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
  );

  try {
    setLoading(true);

    const result = await injected.signer.signPayload({
      address: signerAddress,
      method: tx.method.toHex(),
    });

    // Retrieve the method returned by Mimir.
    const api = getLatestApi();
    const method = api.registry.createType("Call", result.payload.method);

    // check the final call is the expect call
    if (!checkCall(api, method, tx.method)) {
      throw new Error("not an safe method");
    }

    // Reconstruct a new tx.
    const multisigTx = api.tx[method.section][method.method](...method.args);
    multisigTx.addSignature(result.signer, result.signature, result.payload);

    const unsub = await multisigTx.send(
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

  return true;
}
