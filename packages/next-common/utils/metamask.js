import { addressEllipsis } from ".";
import ChainTypes from "./consts/chainTypes";
import WalletTypes from "./consts/walletTypes";
import { normalizeAddress } from "./address";
import { getChainId as getEvmChainId, getAccount } from "@wagmi/core";
import { wagmiConfig } from "next-common/context/wagmi";
import getChainSettings from "./consts/settings";
import { CHAIN } from "./constants";
import { hexToNumber } from "viem";

export async function getEthereumProvider() {
  const { connector } = getAccount(wagmiConfig);
  return await connector.getProvider();
}

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

export function getChainId() {
  const { connector } = getAccount(wagmiConfig);
  return getEvmChainId(wagmiConfig, { connector });
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
  // const connections = getConnections(wagmiConfig);
  // return await switchChain(wagmiConfig, {
  //   chainId,
  //   // connector: connections[0]?.connector,
  // });
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

export function isSameChainId() {
  const chainId = getChainId();
  const { ethereumNetwork } = getChainSettings(CHAIN);
  const chainSettingsId = hexToNumber(ethereumNetwork.chainId);

  return chainId === chainSettingsId;
}
