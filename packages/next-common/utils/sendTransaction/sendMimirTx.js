import { inject, isMimirReady, MIMIR_REGEXP } from "@mimirdev/apps-inject";
import { noop } from "lodash-es";
import { createSendTxEventHandler } from "./sendSubstrateTx";
import getOriginForExtension from "next-common/utils/extension/origin";

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

  await web3Enable(getOriginForExtension());
  const injected = await web3FromSource("mimir");

  const isMimir = injected.name === "mimir";
  if (!isMimir) {
    return false;
  }

  onStarted();

  try {
    const unsub = await tx.signAndSend(
      signerAddress,
      { signer: injected.signer, withSignedTransaction: true },
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
