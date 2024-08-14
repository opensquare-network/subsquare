import { ethers } from "ethers";
import {
  getConnector,
  getEthereum,
  isSameChainId,
  requestAccounts,
  switchNetwork,
} from "../metamask";
import getChainSettings from "../consts/settings";
import { getEvmSignerAddress } from "../mixedChainUtil";
import isHydradx from "../isHydradx";
import { hexToNumber } from "viem";
import { noop } from "lodash-es";

export const DISPATCH_PRECOMPILE_ADDRESS =
  "0x0000000000000000000000000000000000000401";

export async function sendEvmTx({
  to,
  data,
  onStarted = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onError = noop,
  signerAddress,
}) {
  const realSignerAddress = getEvmSignerAddress(signerAddress);
  const connector = getConnector();

  const ethereum = await getEthereum();

  if (!ethereum) {
    onError(new Error("Please install MetaMask"));
    return;
  }
  const walletName = connector.name;

  const { ethereumNetwork } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);

  const chainId = hexToNumber(ethereumNetwork.chainId);

  if (!isSameChainId(chainId)) {
    try {
      await switchNetwork(chainId);
    } catch (e) {
      onError(
        new Error(
          `Cannot switch to chain ${ethereumNetwork.chainName}, please add the network configuration to ${walletName} wallet.`,
        ),
      );
      return;
    }
  }

  if (ethereum?.isTalisman) {
    if (
      ethereum.selectedAddress &&
      ethereum.selectedAddress?.toLowerCase() !==
        realSignerAddress.toLowerCase()
    ) {
      onError(
        new Error(
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
      onError(
        new Error(
          `Please switch to correct account from ${walletName}: ${realSignerAddress}`,
        ),
      );
      return;
    }
  }

  onStarted();

  try {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    await dispatchCall({
      to,
      provider,
      signer,
      signerAddress: realSignerAddress,
      data,
      onSubmitted,
      onInBlock,
    });
  } catch (e) {
    onError(e);
  }
}

async function dispatchCall({
  to = DISPATCH_PRECOMPILE_ADDRESS,
  provider,
  signer,
  signerAddress,
  data,
  onSubmitted = noop,
  onInBlock = noop,
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
    const gas = await provider.estimateGas(tx);
    sentTx = await signer.sendTransaction({
      gasLimit: gas,
      ...tx,
    });
  }

  onSubmitted();

  const receipt = await sentTx.wait();
  onInBlock({ receipt });
}

async function dryRun(provider, tx) {
  await provider.call(tx);
}
