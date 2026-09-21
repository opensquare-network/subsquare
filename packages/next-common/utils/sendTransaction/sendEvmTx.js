import { ethers } from "ethers";
import {
  addNetwork,
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
import Chains from "../consts/chains";

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

  const isHydrationWalletConnect =
    ["walletConnect", "walletConnectUniversal"].includes(connector.id) &&
    process.env.NEXT_PUBLIC_CHAIN === Chains.hydradx;

  let chainAction = "check the current chain";
  try {
    if (isHydrationWalletConnect) {
      chainAction = "add the Hydration network";
      await addNetwork(ethereum, ethereumNetwork);
      chainAction = "switch to Hydration";
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethereumNetwork.chainId }],
      });
    } else if (!isSameChainId(chainId)) {
      await switchNetwork(chainId);
    }
  } catch (cause) {
    console.error("Error switching network:", chainAction, cause);
    const message = isHydrationWalletConnect
      ? `Cannot ${chainAction}: ${
          cause?.details || cause?.message || String(cause)
        }`
      : `Cannot switch to chain ${ethereumNetwork.chainName}, please add the network configuration to ${walletName} wallet.`;
    onError(new Error(message, { cause }));
    return false;
  }

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

  return true;
}

export async function sendEvmTx({
  api,
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
      api,
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

function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNone && phase.value.toNumber() === extrinsicIndex;
  });
}

function getEthereumConsensusLog(api, block) {
  const digest = api.registry.createType(
    "Digest",
    block.block.header.digest,
    true,
  );

  for (const log of digest.logs) {
    if (!log.isConsensus) {
      continue;
    }
    const [engine, data] = log.asConsensus;
    if (engine.toHuman() !== "fron") {
      continue;
    }

    return data;
  }

  throw new Error("Cannot find ethereum consensus log");
}

function getEthereumTransactIndex(logData, evmTxHash) {
  // data[0] = 0x01
  // data[1..33] = ethereum block hash
  // data[33] = number of transactions * 4
  // data[34..66] = transaction hash #1
  // data[66..99] = transaction hash #2
  // ...
  const evmTxCount = logData[33] / 4;
  for (let i = 0; i < evmTxCount; i++) {
    const start = 34 + i * 32;
    const txBytes = logData.slice(start, start + 32);
    const txHash = "0x" + Buffer.from(txBytes).toString("hex");
    if (txHash === evmTxHash) {
      return i;
    }
  }

  throw new Error("Cannot find ethereum transaction index");
}

function getEthereumTransactExtrinsicIndex(block, ethTransactIndex) {
  let currEthTransactIndex = 0;
  for (
    let extrinsicIndex = 0;
    extrinsicIndex < block.block.extrinsics.length;
    extrinsicIndex++
  ) {
    const extrinsic = block.block.extrinsics[extrinsicIndex];
    const { section, method } = extrinsic.method;
    if (section === "ethereum" && method === "transact") {
      if (currEthTransactIndex === ethTransactIndex) {
        return extrinsicIndex;
      }
      currEthTransactIndex++;
    }
  }

  throw new Error("Cannot find ethereum transact extrinsic index");
}

async function handleEvmOnInBlock({ api, receipt, onInBlock }) {
  const blockHash = await api.rpc.chain.getBlockHash(receipt.blockNumber);
  const [block, blockEvents] = await Promise.all([
    api.rpc.chain.getBlock(blockHash),
    api.query.system.events.at(blockHash),
  ]);

  const logData = getEthereumConsensusLog(api, block);
  const ethTransactIndex = getEthereumTransactIndex(logData, receipt.hash);
  const extrinsicIndex = getEthereumTransactExtrinsicIndex(
    block,
    ethTransactIndex,
  );
  const events = extractExtrinsicEvents(blockEvents, extrinsicIndex);

  onInBlock({ events, blockHash: blockHash.toJSON() });
}

async function dispatchCall({
  api,
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
  try {
    await handleEvmOnInBlock({ api, receipt, onInBlock });
  } catch {
    onInBlock({ receipt });
  }
}

async function dryRun(provider, tx) {
  await provider.call(tx);
}
