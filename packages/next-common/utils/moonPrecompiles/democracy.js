import { emptyFunction } from "..";
import { getLastApi } from "../hooks/useApi";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  newWarningToast,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";
import { getContract } from "./common";

const DEMOCRACY_ADDRESS = "0x0000000000000000000000000000000000000803";

const democracyAbi = [
  "function delegate(address,uint256,uint256)",
  "function unDelegate()",
];

async function runContractMethod({
  method,
  args = [],
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
  onFinalized = emptyFunction,
  setLoading = emptyFunction,
  onClose = emptyFunction,
  signerAddress,
  dispatch,
  isMounted,
}) {
  const democracy = await getContract(DEMOCRACY_ADDRESS, democracyAbi);

  const noWaitForFinalized = onFinalized === emptyFunction;
  const totalSteps = noWaitForFinalized ? 2 : 3;

  const toastId = newToastId();
  dispatch(
    newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
  );

  try {
    const submittedTx = await democracy[method].call(democracy, ...args);

    dispatch(
      updatePendingToast(
        toastId,
        `(2/${totalSteps}) Submitted, waiting for wrapping...`,
      ),
    );
    onSubmitted(signerAddress);
    onClose();

    const receipt = await submittedTx.wait();

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

    if (onFinalized !== emptyFunction) {
      const api = getLastApi();
      const unsub = await api?.rpc.chain.subscribeFinalizedHeads(
        async ({ number }) => {
          if (number.toNumber() < receipt.blockNumber) {
            return;
          }
          if (unsub) {
            unsub();
          }
          dispatch(removeToast(toastId));
          onFinalized(receipt.blockHash);
        },
      );
    }

    return receipt;
  } catch (e) {
    dispatch(removeToast(toastId));
    if (e.info?.error?.code === 4001) {
      dispatch(newWarningToast(e.info?.error?.message));
    } else {
      dispatch(newErrorToast(e.info?.error?.message || e.message));
    }
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
}

export function delegate({
  args: { targetAddress, conviction, amount },
  onSubmitted,
  onInBlock,
  onFinalized,
  setLoading,
  onClose,
  signerAddress,
  dispatch,
  isMounted,
}) {
  return runContractMethod({
    method: "delegate",
    args: [targetAddress, conviction, amount],
    onSubmitted,
    onInBlock,
    onFinalized,
    setLoading,
    onClose,
    signerAddress,
    dispatch,
    isMounted,
  });
}

export function unDelegate({
  onSubmitted,
  onInBlock,
  onFinalized,
  setLoading,
  onClose,
  signerAddress,
  dispatch,
  isMounted,
}) {
  return runContractMethod({
    method: "unDelegate",
    onSubmitted,
    onInBlock,
    onFinalized,
    setLoading,
    onClose,
    signerAddress,
    dispatch,
    isMounted,
  });
}
