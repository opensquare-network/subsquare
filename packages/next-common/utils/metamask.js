import { useEffect, useState } from "react";
import { addressEllipsis } from ".";
import ChainTypes from "./consts/chainTypes";
import WalletTypes from "./consts/walletTypes";

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

export async function personalSign(message, address) {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }

  return await ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });
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

export async function addNetwork(ethereumNetwork) {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }

  return await ethereum.request({
    method: "wallet_addEthereumChain",
    params: [ethereumNetwork],
  });
}

export function normalizedMetaMaskAccounts(accounts) {
  return accounts.map((item) => ({
    name: addressEllipsis(item),
    address: item,
    type: ChainTypes.ETHEREUM,
    meta: {
      source: WalletTypes.METAMASK,
      name: addressEllipsis(item),
    },
  }));
}

export function useMetaMaskAccounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const ethereum = getMetaMaskEthereum();
    if (!ethereum) {
      return;
    }

    requestAccounts().then((accounts) => {
      setAccounts(normalizedMetaMaskAccounts(accounts));
    });

    ethereum.on("accountsChanged", (accounts = []) => {
      setAccounts(normalizedMetaMaskAccounts(accounts));
    });
  }, []);

  return accounts;
}
