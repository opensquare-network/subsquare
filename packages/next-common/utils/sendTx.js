import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "../store/reducers/toastSlice";

export async function sendTx({
  tx,
  dispatch,
  setLoading,
  onFinalized,
  onInBlock,
  onSubmitted,
  onClose,
  signerAddress,
  isMounted,
  section: sectionName,
  method: methodName,
}) {
  const toastId = newToastId();
  dispatch(newPendingToast(toastId, "Waiting for signing..."));

  try {
    setLoading(true);

    const unsub = await tx.signAndSend(
      signerAddress,
      ({ events = [], status }) => {
        if (status.isFinalized) {
          onFinalized(signerAddress);
          unsub();
        }
        if (status.isInBlock) {
          // Transaction went through
          dispatch(removeToast(toastId));

          for (const event of events) {
            const { section, method } = event.event;
            if (section === "system" && method === "ExtrinsicFailed") {
              dispatch(newErrorToast(`Extrinsic Failed`));
              return;
            }
          }

          dispatch(newSuccessToast("InBlock"));

          for (const event of events) {
            const { section, method, data } = event.event;
            if (section !== sectionName || method !== methodName) {
              continue;
            }
            const eventData = data.toJSON();
            onInBlock(eventData);
            break;
          }
        }
      }
    );

    dispatch(updatePendingToast(toastId, "Broadcasting"));

    onSubmitted(signerAddress);
    onClose();
  } catch (e) {
    dispatch(removeToast(toastId));
    dispatch(newErrorToast(e.message));
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
}
