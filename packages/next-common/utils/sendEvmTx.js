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
import { getEthereum, requestAccounts, switchNetwork } from "./metamask";
import getChainSettings from "./consts/settings";
import Chains from "./consts/chains";
import { substrateToEvmAddress } from "./hydradxUtil";
import { isEthereumAddress } from "@polkadot/util-crypto";

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
}) {
  let realSignerAddress = signerAddress;
  if (
    process.env.NEXT_PUBLIC_CHAIN === Chains.hydradx &&
    !isEthereumAddress(signerAddress)
  ) {
    realSignerAddress = await substrateToEvmAddress(signerAddress);
  }

  const ethereum = getEthereum();
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

  const accounts = await requestAccounts();
  if (accounts?.[0]?.toLowerCase() !== realSignerAddress.toLowerCase()) {
    dispatch(
      newErrorToast(
        `Please switch to correct account from MetaMask: ${realSignerAddress}`,
      ),
    );
    return;
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
      signerAddress: realSignerAddress,
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
      onInBlock: () => {
        setLoading(false);
        dispatch(removeToast(toastId));
        onInBlock();
      },
    });
  } catch (e) {
    dispatch(removeToast(toastId));
    setLoading(false);

    if (e.info?.error?.code === 4001) {
      dispatch(newWarningToast(e.info?.error?.message));
    } else {
      dispatch(
        newErrorToast(
          e.info?.error?.data?.message || e.info?.error?.message || e.message,
        ),
      );
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

  let sentTx = null;

  if (process.env.NEXT_PUBLIC_CHAIN === Chains.hydradx) {
    const [gas, feeData] = await Promise.all([
      provider.estimateGas(tx),
      provider.getFeeData(),
    ]);

    sentTx = await signer.sendTransaction({
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      maxFeePerGas: feeData.maxFeePerGas,
      gasLimit: (gas * 11n) / 10n, // add 10%
      ...tx,
    });
  } else {
    tx.gasLimit = await provider.estimateGas(tx);
    sentTx = await signer.sendTransaction(tx);
  }

  onSubmitted();
  let receipt = await sentTx.wait();
  onInBlock(receipt);
  return receipt;
}

async function dryRun(provider, tx) {
  await provider.call(tx);
}
