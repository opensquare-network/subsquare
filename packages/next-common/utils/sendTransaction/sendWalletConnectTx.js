import { noop } from "lodash-es";
import { createSendTxEventHandler } from "./sendSubstrateTx";

export async function sendWalletConnectTx({
  api,
  tx,
  signerAddress,
  buildPayload = noop,
  signWcTx = noop,
  onStarted = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onFinalized = noop,
  onError = noop,
}) {
  onStarted();

  try {
    const payload = await buildPayload(tx);
    const { signature } = await signWcTx(payload);
    const rawPayload = api.registry.createType("ExtrinsicPayload", payload, {
      version: payload.version,
    });

    tx.addSignature(signerAddress, signature, rawPayload);

    const unsub = await tx.send(
      createSendTxEventHandler({
        onFinalized,
        onInBlock,
        onError,
        unsub: () => unsub(),
      }),
    );

    onSubmitted();
  } catch (error) {
    onError(error);
  }

  return true;
}
