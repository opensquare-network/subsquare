import { useCallback } from "react";
import { stringToHex } from "@polkadot/util";
import {
  getEvmSignerAddress,
  tryConvertToEvmAddress,
} from "next-common/utils/mixedChainUtil";
import { useSignMessage as useEVMSignMessage } from "wagmi";
import { metamask } from "next-common/utils/consts/connect";
import { useGetInjectedWeb3ExtensionFn } from "next-common/components/wallet/useInjectedWeb3Extension";

export function useSignMessage() {
  const getInjectedWeb3Extension = useGetInjectedWeb3ExtensionFn();
  const { signMessage } = useEVMSignMessage();

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

      const extension = getInjectedWeb3Extension(walletName);
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
    [signMessage, getInjectedWeb3Extension],
  );
}
