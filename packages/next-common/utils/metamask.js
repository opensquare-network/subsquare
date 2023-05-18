import { useEffect, useState } from "react";
import { addressEllipsis } from ".";

export function getMetaMaskEthereum() {
  if (window.ethereum && window.ethereum.isMetaMask && !window.ethereum.isTalisman) {
    return window.ethereum;
  }

  return null;
}

export async function personalSign(message, address) {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });
}

export async function getChainId() {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await ethereum.request({
    method: "eth_chainId",
  });
}

export async function requestAccounts() {
  const ethereum = getMetaMaskEthereum();
  if (!ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await ethereum.request({
    method: "eth_requestAccounts",
  });
}

export function normalizedMetaMaskAccounts(accounts) {
  return accounts.map((item) => ({
    name: addressEllipsis(item),
    address: item,
    type: "ethereum",
    meta: {
      source: "metamask",
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
