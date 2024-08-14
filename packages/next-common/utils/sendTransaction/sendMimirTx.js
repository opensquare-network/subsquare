import { inject, isMimirReady, MIMIR_REGEXP } from "@mimirdev/apps-inject";
import { checkCall } from "@mimirdev/apps-sdk";
import { getLatestApi } from "next-common/context/api";
import { noop } from "lodash-es";
import { createSendTxEventHandler } from "./sendSubstrateTx";

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
  onStarted = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onError = noop,
  signerAddress,
}) {
  const { web3Enable, web3FromSource } = await import(
    "@polkadot/extension-dapp"
  );

  await web3Enable("subsquare");
  const injected = await web3FromSource("mimir");

  const isMimir = injected.name === "mimir";
  if (!isMimir) {
    return false;
  }

  onStarted();

  try {
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
        onFinalized,
        onInBlock,
        onError,
        unsub: () => unsub(),
      }),
    );

    onSubmitted();
  } catch (e) {
    onError(e);
  }

  return true;
}
