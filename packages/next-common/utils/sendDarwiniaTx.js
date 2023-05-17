import { ethers } from "ethers";
import { emptyFunction } from ".";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";

export async function sendTxDarwinia2({
  tx,
  dispatch,
  setLoading = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
  signerAddress,
  isMounted,
}) {
  const noWaitForFinalized = onFinalized === emptyFunction;
  const totalSteps = noWaitForFinalized ? 2 : 3;

  const toastId = newToastId();
  dispatch(
    newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
  );

  try {
    setLoading(true);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    await dispatchCall({
      provider,
      signer,
      signerAddress,
      data: tx.inner.toU8a(),
      onSubmitted: () => {
        dispatch(
          updatePendingToast(
            toastId,
            `(2/${totalSteps}) Submitted, waiting for wrapping...`,
          ),
        );
        onSubmitted(signerAddress);
        onClose();
      },
      onInBlock: (receipt) => {
        if (noWaitForFinalized) {
          dispatch(removeToast(toastId));
        } else {
          dispatch(
            updatePendingToast(
              toastId,
              `(3/${totalSteps}) Inblock, waiting for finalization...`,
            ),
          );
        }
        onInBlock(receipt);
      },
      onFinalized: (receipt) => {
        dispatch(removeToast(toastId));
        onFinalized(receipt.blockHash);
      },
    });
  } catch (e) {
    dispatch(removeToast(toastId));
    dispatch(newErrorToast(e.message));
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
}

async function dispatchCall({
  provider,
  signer,
  signerAddress,
  data,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
  onFinalized = emptyFunction,
}) {
  const contractAddress = "0x0000000000000000000000000000000000000401";
  let tx = {
    from: signerAddress,
    to: contractAddress,
    data: data,
  };
  await dryRun(provider, tx);
  tx.gasLimit = await provider.estimateGas(tx);
  const sentTx = await signer.sendTransaction(tx);
  onSubmitted();
  let receipt = await sentTx.wait();
  onInBlock(receipt);
  receipt = await sentTx.wait(6);
  onFinalized(receipt);
  return receipt;
}

async function dryRun(provider, tx) {
  await provider.call(tx);
}
