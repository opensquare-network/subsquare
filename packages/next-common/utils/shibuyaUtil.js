import { ethers } from "ethers";
import { addressToEvm, evmToAddress } from "@polkadot/util-crypto";
import { getContextConnectedAccount } from "next-common/context/connectedAccount";
import getChainSettings from "./consts/settings";

const substrateToEvmAddressMap = {};

export function evmToSubstrateAddress(address) {
  const { ss58Format } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  const substrateAddress = evmToAddress(address, ss58Format);
  substrateToEvmAddressMap[substrateAddress] = address;
  return substrateAddress;
}

export function substrateToEvmAddress(address) {
  if (address in substrateToEvmAddressMap) {
    return substrateToEvmAddressMap[address];
  }

  const connectedAccount = getContextConnectedAccount();
  if (
    connectedAccount &&
    connectedAccount?.address === address &&
    connectedAccount?.evmAddress
  ) {
    return connectedAccount?.evmAddress;
  }

  return ethers.getAddress(
    "0x" + Buffer.from(addressToEvm(address)).toString("hex"),
  );
}

export function checkIfShouldConvertToEvmAddress(address) {
  if (address in substrateToEvmAddressMap) {
    return true;
  }

  const connectedAccount = getContextConnectedAccount();
  return (
    connectedAccount &&
    connectedAccount?.address === address &&
    connectedAccount?.evmAddress
  );
}
