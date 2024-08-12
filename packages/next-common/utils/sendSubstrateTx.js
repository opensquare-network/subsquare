import {
  newErrorToast,
  newPendingToast,
  newToastId,
  newWarningToast,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";
import { emptyFunction } from ".";
import { createSendTxEventHandler } from "./sendTx";

export async function sendSubstrateTx({
  api,
  tx,
  dispatch,
  setLoading = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
  signerAddress,
}) {
  const noWaitForFinalized = onFinalized === emptyFunction;
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
