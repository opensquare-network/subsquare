import { ethers } from "ethers";
import { addressToEvm, evmToAddress } from "@polkadot/util-crypto";
import { getContextConnectedAccount } from "next-common/context/connectedAccount";

export function evmToSubstrateAddress(address) {
  return evmToAddress(address, 5);
}

export function substrateToEvmAddress(address) {
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
  const connectedAccount = getContextConnectedAccount();
  return (
    connectedAccount &&
    connectedAccount?.address === address &&
    connectedAccount?.evmAddress
  );
}
