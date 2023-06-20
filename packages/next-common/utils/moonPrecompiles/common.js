import { ethers } from "ethers";
import { getMetaMaskEthereum } from "../metamask";

export function getProvider() {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }
  return new ethers.BrowserProvider(ethereum);
}

export async function getContract(contractAddress, contractAbi) {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(
    contractAddress,
    contractAbi,
    signer,
  );
}
