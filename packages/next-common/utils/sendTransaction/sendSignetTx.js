import { getSignetSdk } from "next-common/context/signet";
import { noop } from "lodash-es";

export async function maybeSendSignetTx({
  tx,
  onStarted = noop,
  onSubmitted = noop,
  onEnded = noop,
  onError = noop,
}) {
  const sdk = getSignetSdk();
  if (!sdk) {
    throw new Error("Signet SDK is initialized.");
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
