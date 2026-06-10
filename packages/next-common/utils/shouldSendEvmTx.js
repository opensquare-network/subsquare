import { isEthereumAddress } from "@polkadot/util-crypto";
import WalletTypes from "next-common/utils/consts/walletTypes";
import isEvmChain from "next-common/utils/isEvmChain";
import isMixedChain from "next-common/utils/isMixedChain";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export default function shouldSendEvmTx(signerAccount) {
  const isWalletMetamask = signerAccount?.meta?.source === WalletTypes.METAMASK;
  if ((isEvmChain() || isMixedChain()) && isWalletMetamask) {
    return true;
  }
  const isEvmAddr = isEthereumAddress(
    tryConvertToEvmAddress(signerAccount?.address),
  );
  const isWalletTalisman = signerAccount?.meta?.source === WalletTypes.TALISMAN;
  return isMixedChain() && isEvmAddr && isWalletTalisman;
}
