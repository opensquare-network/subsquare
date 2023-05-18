import { useEffect, useState } from "react";
import { addressEllipsis } from ".";

export async function personalSign(message, address) {
  if (!window.ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await window.ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });
}

export async function getChainId() {
  if (!window.ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await window.ethereum.request({
    method: "eth_chainId",
  });
}

export async function requestAccounts() {
  if (!window.ethereum) {
    throw new Error("No ethereum provider found");
  }

  return await window.ethereum.request({
    method: "eth_requestAccounts",
  });
}

export function normalizedMetaMaskAccounts(accounts) {
  return accounts.map((item) => ({
    name: addressEllipsis(item),
    address: item,
    type: "ethereum",
  }));
}

export function useMetaMaskAccounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    requestAccounts().then((accounts) => {
      setAccounts(normalizedMetaMaskAccounts(accounts));
    });

    window.ethereum.on("accountsChanged", (accounts = []) => {
      setAccounts(normalizedMetaMaskAccounts(accounts));
    });
  }, []);

  return accounts;
}
