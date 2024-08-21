import { noop } from "lodash-es";

export async function maybeSendSignetTx({
  sdk,
  tx,
  onStarted = noop,
  onSubmitted = noop,
  onEnded = noop,
  onError = noop,
}) {
  if (!sdk) {
    throw new Error("Signet SDK is not initialized.");
  }

  try {
    onStarted();

    const res = await sdk.send(tx.method.toHex());

    if (res.ok) {
      onSubmitted();
    } else {
      onError(new Error(res.error));
    }

    onEnded();
    return true;
  } catch (e) {
    onError(e);
  }

  return true;
}
