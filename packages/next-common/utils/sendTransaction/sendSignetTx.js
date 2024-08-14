import { getSignetSdk } from "next-common/context/signet";
import { noop } from "lodash-es";

export async function maybeSendSignetTx({
  tx,
  onSubmitted = noop,
  onError = noop,
}) {
  try {
    const sdk = getSignetSdk();
    if (!sdk) {
      throw new Error("Signet SDK is initialized.");
    }
    const res = await sdk.send(tx.method.toHex());

    if (res.ok) {
      onSubmitted();
    } else {
      onError(new Error(res.error));
    }

    return true;
  } catch (e) {
    onError(e);
  }

  return true;
}
