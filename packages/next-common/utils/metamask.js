import { addressEllipsis } from ".";
import ChainTypes from "./consts/chainTypes";
import WalletTypes from "./consts/walletTypes";
import { normalizeAddress } from "./address";

export function getMetaMaskEthereum() {
  if (
    window.ethereum &&
    window.ethereum.isMetaMask &&
    !window.ethereum.isTalisman
  ) {
    return window.ethereum;
  }

  return null;
}

export function getEthereum(wallet) {
  if (wallet === WalletTypes.TALISMAN) {
    return window.talismanEth;
  }

  if (
    window.ethereum &&
    window.ethereum.isMetaMask &&
    !window.ethereum.isTalisman
  ) {
    return window.ethereum;
  }

  return null;
}

export async function getChainId() {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }

  return await ethereum.request({
    method: "eth_chainId",
  });
}

export async function requestAccounts() {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }

  return await ethereum.request({
    method: "eth_requestAccounts",
  });
}

export async function addNetwork(ethereum, ethereumNetwork) {
  return await ethereum.request({
    method: "wallet_addEthereumChain",
    params: [ethereumNetwork],
  });
}

export async function switchNetwork(ethereum, chainId) {
  return await ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId }],
  });
}

export function normalizeEVMAccount(address, source) {
  return {
    name: addressEllipsis(address),
    address: normalizeAddress(address),
    type: ChainTypes.ETHEREUM,
    meta: {
      source,
      name: addressEllipsis(address),
    },
  };
}
