import { emptyFunction } from ".";
import {
  newErrorToast,
  newPendingToast,
  newWarningToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "../store/reducers/toastSlice";

export function getDispatchError(dispatchError) {
  let message = dispatchError.type;

  if (dispatchError.isModule) {
    try {
      const mod = dispatchError.asModule;
      const error = dispatchError.registry.findMetaError(mod);

      message = `${error.section}.${error.name}`;
    } catch (error) {
      // swallow
    }
  } else if (dispatchError.isToken) {
    message = `${dispatchError.type}.${dispatchError.asToken.type}`;
  }

  return message;
}

export async function sendTx({
  tx,
  dispatch,
  setLoading = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
  signerAddress,
  isMounted,
  section: sectionName,
  method: methodName,
}) {
  const noWaitForFinalized = onFinalized === emptyFunction;
  const totalSteps = noWaitForFinalized ? 2 : 3;

  const toastId = newToastId();
  dispatch(
    newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`)
  );

  try {
    setLoading(true);

    let blockHash = null;

    const unsub = await tx.signAndSend(
      signerAddress,
      ({ events = [], status }) => {
        if (status.isFinalized) {
          dispatch(removeToast(toastId));
          onFinalized(blockHash);
          unsub();
        }

        if (status.isInBlock) {
          blockHash = status.asInBlock.toString();

          for (const event of events) {
            const { section, method, data } = event.event;
            if (section === "system" && method === "ExtrinsicFailed") {
              const [dispatchError] = data;
              const message = getDispatchError(dispatchError);
              dispatch(removeToast(toastId));
              dispatch(newErrorToast(`Extrinsic failed: ${message}`));
              return;
            }
          }

          if (noWaitForFinalized) {
            dispatch(removeToast(toastId));
          } else {
            dispatch(
              updatePendingToast(
                toastId,
                `(3/${totalSteps}) Inblock, waiting for finalization...`
              )
            );
          }

          for (const event of events) {
            const { section, method, data } = event.event;
            if (section !== sectionName || method !== methodName) {
              continue;
            }
            const eventData = data.toJSON();
            onInBlock(eventData);
            break;
          }

          if (!sectionName || !methodName) {
            onInBlock();
          }
        }
      }
    );

    dispatch(
      updatePendingToast(
        toastId,
        `(2/${totalSteps}) Submitted, waiting for wrapping...`
      )
    );
    onSubmitted(signerAddress);
    onClose();
  } catch (e) {
    dispatch(removeToast(toastId));

    if (e.message === "Cancelled") {
      dispatch(newWarningToast(e.message));
    } else {
      dispatch(newErrorToast(e.message));
    }
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
}
