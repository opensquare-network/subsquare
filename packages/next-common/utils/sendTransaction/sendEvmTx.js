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
import { hexToNumber } from "viem";
import { noop } from "lodash-es";

export const DISPATCH_PRECOMPILE_ADDRESS =
  "0x0000000000000000000000000000000000000401";

export async function prepareEthereum({ ethereum, onError, signerAddress }) {
  const connector = getConnector();

  if (!ethereum) {
    onError(new Error("Please install MetaMask"));
    return false;
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
      return false;
    }
  }

  if (ethereum?.isTalisman) {
    if (
      ethereum.selectedAddress &&
      ethereum.selectedAddress?.toLowerCase() !== signerAddress.toLowerCase()
    ) {
      onError(
        new Error(
          `Please switch to correct account from ${walletName}: ${signerAddress}`,
        ),
      );
      return false;
    }
  } else {
    const accounts = await requestAccounts();
    const walletSelectedAddress = accounts?.[0];

    if (walletSelectedAddress?.toLowerCase() !== signerAddress.toLowerCase()) {
      onError(
        new Error(
          `Please switch to correct account from ${walletName}: ${signerAddress}`,
        ),
      );
      return false;
    }
  }

  return true;
}

export async function sendEvmTx({
  data,
  onStarted = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onError = noop,
  signerAddress,
}) {
  const evmSignerAddress = getEvmSignerAddress(signerAddress);
  const ethereum = await getEthereum();
  const ok = await prepareEthereum({
    ethereum,
    onError,
    signerAddress: evmSignerAddress,
  });
  if (!ok) {
    return;
  }

  onStarted();

  try {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    await dispatchCall({
      provider,
      signer,
      signerAddress: evmSignerAddress,
      data,
      onSubmitted,
      onInBlock,
    });
  } catch (e) {
    onError(e);
  }
}

async function dispatchCall({
  provider,
  signer,
  signerAddress,
  data,
  onSubmitted = noop,
  onInBlock = noop,
}) {
  let tx = {
    from: signerAddress,
    to: DISPATCH_PRECOMPILE_ADDRESS,
    data: `0x${Buffer.from(data).toString("hex")}`,
  };

  await dryRun(provider, tx);

  let sentTx = null;

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

  onSubmitted();

  const receipt = await sentTx.wait();
  onInBlock({ receipt });
}

async function dryRun(provider, tx) {
  await provider.call(tx);
}
