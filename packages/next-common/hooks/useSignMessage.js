import { useCallback } from "react";
import { stringToHex } from "@polkadot/util";
import {
  getEvmSignerAddress,
  tryConvertToEvmAddress,
} from "next-common/utils/mixedChainUtil";
import { useSignMessage as useEVMSignMessage } from "wagmi";
import { metamask, walletConnect } from "next-common/utils/consts/connect";
import { findInjectedExtension } from "next-common/hooks/connect/useInjectedWeb3Extension";
import useInjectedWeb3 from "./connect/useInjectedWeb3";
import { useWalletConnect } from "next-common/context/walletconnect";

export function useSignMessage() {
  const { injectedWeb3 } = useInjectedWeb3();
  const { signMessage } = useEVMSignMessage();
  const { signWcMessage } = useWalletConnect();

  return useCallback(
    async (message, address, walletName) => {
      const shouldUseEVMSign = walletName === metamask.extensionName;

      if (shouldUseEVMSign) {
        const signerAddress = getEvmSignerAddress(address);
        return await new Promise((resolve, reject) => {
          signMessage(
            { account: signerAddress, message },
            { onSuccess: resolve, onError: reject },
          );
        });
      }

      if (walletName === walletConnect.extensionName) {
        const { signature } = await signWcMessage({
          type: "bytes",
          address,
          message: stringToHex(message),
        });

        return signature;
      }

      const extension = findInjectedExtension(walletName, injectedWeb3);
      if (!extension) {
        throw new Error("Wallet not found: " + walletName);
      }

      const wallet = await extension.enable("subsquare");
      const maybeEvmAddress = tryConvertToEvmAddress(address);
      const { signature } = await wallet.signer.signRaw({
        type: "bytes",
        data: stringToHex(message),
        address: maybeEvmAddress,
      });

      return signature;
    },
    [injectedWeb3, signMessage, signWcMessage],
  );
}
