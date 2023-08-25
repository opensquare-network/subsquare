import { ethers } from "ethers";
import { emptyFunction } from ".";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  newWarningToast,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";
import { getMetaMaskEthereum, switchNetwork } from "./metamask";
import getChainSettings from "./consts/settings";

export const DISPATCH_PRECOMPILE_ADDRESS =
  "0x0000000000000000000000000000000000000401";

export async function sendEvmTx({
  to,
  data,
  dispatch,
  setLoading = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
  signerAddress,
  isMounted,
}) {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    dispatch(newErrorToast("Please install MetaMask"));
    return;
  }

  const toastId = newToastId();

  const { ethereumNetwork } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (ethereum.chainId !== ethereumNetwork.chainId) {
    dispatch(
      newPendingToast(
        toastId,
        `Switching the wallet to network: ${ethereumNetwork.chainName}`,
      ),
    );
    try {
      await switchNetwork(ethereumNetwork.chainId);
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    } finally {
      dispatch(removeToast(toastId));
    }
  }

  const totalSteps = 2;
  dispatch(
    newPendingToast(toastId, `(1/${totalSteps}) Waiting for signing...`),
  );

  try {
    setLoading(true);

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    await dispatchCall({
      to,
      provider,
      signer,
      signerAddress,
      data,
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
        dispatch(removeToast(toastId));
        onInBlock(receipt);
      },
    });
  } catch (e) {
    dispatch(removeToast(toastId));
    if (e.info?.error?.code === 4001) {
      dispatch(newWarningToast(e.info?.error?.message));
    } else {
      dispatch(
        newErrorToast(
          e.info?.error?.data?.message || e.info?.error?.message || e.message,
        ),
      );
    }
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
}

async function dispatchCall({
  to = DISPATCH_PRECOMPILE_ADDRESS,
  provider,
  signer,
  signerAddress,
  data,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  let tx = {
    from: signerAddress,
    to,
    data: data,
  };
  await dryRun(provider, tx);
  tx.gasLimit = await provider.estimateGas(tx);
  const sentTx = await signer.sendTransaction(tx);
  onSubmitted();
  let receipt = await sentTx.wait();
  onInBlock(receipt);
  return receipt;
}

async function dryRun(provider, tx) {
  await provider.call(tx);
}
