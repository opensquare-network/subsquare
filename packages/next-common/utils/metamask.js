import { addressEllipsis } from ".";
import ChainTypes from "./consts/chainTypes";
import { normalizeAddress } from "./address";
import { getChainId as getEvmChainId, getAccount } from "@wagmi/core";
import { wagmiConfig } from "next-common/context/wagmi";
import WalletTypes from "./consts/walletTypes";

export function getConnector() {
  const { connector } = getAccount(wagmiConfig);
  return connector;
}

export async function getEthereum() {
  const connector = getConnector();
  return await connector.getProvider();
}

export function getChainId() {
  const connector = getConnector();
  return getEvmChainId(wagmiConfig, { connector });
}

export async function requestAccounts() {
  const ethereum = await getEthereum();
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

export function isSameChainId(id) {
  const chainId = getChainId();

  return chainId === id;
}
