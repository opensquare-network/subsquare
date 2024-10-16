import { Contract, ethers, Signature } from "ethers";
import { getEthereum } from "../metamask";
import getChainSettings from "../consts/settings";
import { getEvmSignerAddress } from "../mixedChainUtil";
import { noop } from "lodash-es";
import BigNumber from "bignumber.js";
import { createSendTxEventHandler } from "./sendSubstrateTx";
import { DISPATCH_PRECOMPILE_ADDRESS, prepareEthereum } from "./sendEvmTx";
import CallPermitAbi from "./hydradx/callPermitAbi.json";
import CallPermit from "./hydradx/callPermitType.json";
import EIP712Domain from "./hydradx/eip712DomainType.json";

export const CALL_PERMIT_ADDRESS = "0x000000000000000000000000000000000000080a";
export const CALL_PERMIT_ABI = JSON.stringify(CallPermitAbi);

async function getPermitNonce(provider, address) {
  const callPermit = new Contract(
    CALL_PERMIT_ADDRESS,
    CALL_PERMIT_ABI,
    provider,
  );
  const nonce = await callPermit.nonces(address);
  return BigNumber(nonce.toString());
}

async function dryRun(provider, tx) {
  await provider.call(tx);
}

async function createPermitMessageData({ provider, data, signerAddress }) {
  let tx = {
    from: signerAddress,
    to: DISPATCH_PRECOMPILE_ADDRESS,
    data: `0x${Buffer.from(data).toString("hex")}`,
  };

  await dryRun(provider, tx);

  const settings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  const ethereumNetwork = settings.ethereumNetwork;

  const gas = await provider.estimateGas(tx);
  const nonce = await getPermitNonce(provider, signerAddress);
  const message = {
    ...tx,
    value: 0,
    gaslimit: Number((gas * 11n) / 10n), // add 10%
    nonce: nonce.toNumber(),
    deadline: Math.floor(Date.now() / 1000 + 3600),
  };

  const typedData = JSON.stringify({
    types: {
      EIP712Domain,
      CallPermit,
    },
    primaryType: "CallPermit",
    domain: {
      name: "Call Permit Precompile",
      version: "1",
      chainId: parseInt(ethereumNetwork.chainId),
      verifyingContract: CALL_PERMIT_ADDRESS,
    },
    message: message,
  });

  return {
    typedData,
    message,
  };
}

async function signPermitMessageData({ provider, signerAddress, typedData }) {
  if (typeof provider.send !== "function") {
    throw new Error("Provider does not support request method");
  }
  const method = "eth_signTypedData_v4";
  const params = [signerAddress, typedData];
  const signResult = await provider.send(method, params);
  return Signature.from(signResult);
}

async function dispatchCall({
  api,
  provider,
  signerAddress,
  data,
  onSubmitted = noop,
  onInBlock = noop,
  onFinalized = noop,
  onError = noop,
}) {
  const { message, typedData } = await createPermitMessageData({
    provider,
    data,
    signerAddress,
  });

  const signature = await signPermitMessageData({
    provider,
    signerAddress,
    typedData,
  });

  const finalTx = api.tx.multiTransactionPayment.dispatchPermit(
    message.from,
    message.to,
    message.value,
    message.data,
    message.gaslimit,
    message.deadline,
    signature.v,
    signature.r,
    signature.s,
  );

  try {
    const unsub = await finalTx.send(
      createSendTxEventHandler({
        onFinalized,
        onInBlock,
        onError,
        unsub: () => unsub(),
      }),
    );

    onSubmitted();
  } catch (e) {
    onError(e);
  }
}

export async function sendHydraDXMultiFeeEvmTx({
  api,
  data,
  onStarted,
  onInBlock,
  onSubmitted,
  onFinalized,
  onError,
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
    await dispatchCall({
      api,
      provider,
      signerAddress: evmSignerAddress,
      data,
      onSubmitted,
      onInBlock,
      onFinalized,
      onError,
    });
  } catch (e) {
    onError(e);
  }
}
