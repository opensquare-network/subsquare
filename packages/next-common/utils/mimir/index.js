import { inject, isMimirReady, MIMIR_REGEXP } from "@mimirdev/apps-inject";
import { web3FromSource } from "@polkadot/extension-dapp";
import { checkCall } from "@mimirdev/apps-sdk";

export async function tryInitMimir() {
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

export async function maybeMimirTx(api, tx, signerAccount) {
  const address = signerAccount?.address;
  const injected = await web3FromSource(signerAccount?.meta?.source);

  const isMimir = injected.name === "mimir";

  // ⚠️Note that the following logic will only be executed when injected.name === 'mimir'.
  if (isMimir) {
    const result = await injected.signer.signPayload({
      address,
      method: tx.method.toHex(),
    });

    // Retrieve the method returned by Mimir.
    const method = api.registry.createType("Call", result.payload.method);

    // check the final call is the expect call
    if (!checkCall(method, tx.method)) {
      throw new Error("not an safe method");
    }

    // Reconstruct a new tx.
    tx = api.tx[method.section][method.method](...method.args);

    // add signature to tx
    tx.addSignature(result.signer, result.signature, result.payload);
  }

  return tx;
}
