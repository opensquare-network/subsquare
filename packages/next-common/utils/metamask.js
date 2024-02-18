import { useCallback, useEffect, useState } from "react";
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

export function normalizedMetaMaskAccounts(accounts) {
  return accounts.map((item) => ({
    name: addressEllipsis(item),
    address: normalizeAddress(item),
    type: ChainTypes.ETHEREUM,
    meta: {
      source: WalletTypes.METAMASK,
      name: addressEllipsis(item),
    },
  }));
}

export function useMetaMaskAccounts(active) {
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);

  const updateAccounts = useCallback((accounts = []) => {
    setAccounts(normalizedMetaMaskAccounts(accounts));
  }, []);

  useEffect(() => {
    if (!active) {
      setIsLoading(false);
      return;
    }

    const ethereum = getMetaMaskEthereum();
    if (!ethereum) {
      setIsLoading(false);
      return;
    }

    requestAccounts()
      .then(updateAccounts)
      .finally(() => {
        setIsLoading(false);
      });

    ethereum.on("accountsChanged", updateAccounts);

    return () => {
      ethereum.removeListener("accountsChanged", updateAccounts);
    };
  }, [updateAccounts, active]);

  return [accounts, isLoading];
}
