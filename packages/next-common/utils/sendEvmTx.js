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
import {
  // addNetwork,
  getEthereum,
  requestAccounts,
  switchNetwork,
} from "./metamask";
import getChainSettings from "./consts/settings";
import { getEvmSignerAddress } from "./hydradxUtil";
import isHydradx from "./isHydradx";

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
  signerAccount,
}) {
  const signerAddress = signerAccount?.address;
  const realSignerAddress = getEvmSignerAddress(signerAddress);

  const ethereum = getEthereum(signerAccount?.meta.source);
  if (!ethereum) {
    dispatch(newErrorToast("Please install MetaMask"));
    return;
  }
  const walletName = ethereum?.isTalisman ? "Talisman" : "MetaMask";

  const toastId = newToastId();

  const { ethereumNetwork } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);

  // TODO: There is an RPC error when calling to wallet_addEthereumChain in Talisman wallet.
  // TODO: It should be able to add network configuration automatically instead of asking user to do manually.
  // if (ethereum.chainId !== ethereumNetwork.chainId) {
  //   try {
  //     await addNetwork(ethereum, ethereumNetwork);
  //   } catch (e) {
  //     dispatch(newErrorToast(e.message));
  //     return;
  //   }
  // }

  if (ethereum.chainId !== ethereumNetwork.chainId) {
    dispatch(
      newPendingToast(
        toastId,
        `Switching the wallet to network: ${ethereumNetwork.chainName}`,
      ),
    );
    try {
      await switchNetwork(ethereum, ethereumNetwork.chainId);
    } catch (e) {
      dispatch(
        newErrorToast(
          `Cannot switch to chain ${ethereumNetwork.chainName}, please add the network configuration to ${walletName} wallet.`,
        ),
      );
      return;
    } finally {
      dispatch(removeToast(toastId));
    }
  }

  if (ethereum?.isTalisman) {
    if (
      ethereum.selectedAddress &&
      ethereum.selectedAddress?.toLowerCase() !==
        realSignerAddress.toLowerCase()
    ) {
      dispatch(
        newErrorToast(
          `Please switch to correct account from ${walletName}: ${realSignerAddress}`,
        ),
      );
      return;
    }
  } else {
    const accounts = await requestAccounts();
    const walletSelectedAddress = accounts?.[0];

    if (
      walletSelectedAddress?.toLowerCase() !== realSignerAddress.toLowerCase()
    ) {
      dispatch(
        newErrorToast(
          `Please switch to correct account from ${walletName}: ${realSignerAddress}`,
        ),
      );
      return;
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

  if (isHydradx()) {
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
