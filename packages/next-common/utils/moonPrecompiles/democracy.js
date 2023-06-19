import { ethers } from "ethers";
import { getMetaMaskEthereum } from "../metamask";

const DEMOCRACY_ADDRESS = "0x0000000000000000000000000000000000000803";

const democracyAbi = [
  "function delegate(address,uint256,uint256)",
  "function unDelegate()",
];

function getProvider() {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }
  return new ethers.BrowserProvider(ethereum);
}

async function runContractMethod(method, ...args) {
  const provider = getProvider();
  const signer = await provider.getSigner();
  const democracy = new ethers.Contract(DEMOCRACY_ADDRESS, democracyAbi, signer);

  const unsigedTx = await democracy[method].call(democracy, ...args);
  unsigedTx.gasLimit = await provider.estimateGas(unsigedTx);

  try {
    const signedTx = await signer.signTransaction(unsigedTx);
    const submittedTx = await provider.sendTransaction(signedTx);

    const receipt = await submittedTx.wait();

    if (receipt.status === 0) {
      throw new Error("Delegate transaction failed");
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function delegate(target, conviction, amount) {
  return runContractMethod("delegate", target, conviction, amount);
}

export function unDelegate() {
  return runContractMethod("unDelegate");
}
