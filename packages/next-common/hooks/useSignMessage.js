import { useCallback } from "react";
import { stringToHex } from "@polkadot/util";
import WalletTypes from "next-common/utils/consts/walletTypes";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import {
  getEvmSignerAddress,
  tryConvertToEvmAddress,
} from "next-common/utils/mixedChainUtil";
import { useSignMessage as useEVMSignMessage } from "wagmi";

export function useSignMessage() {
  const { injectedWeb3 } = useInjectedWeb3();
  const { signMessage } = useEVMSignMessage();

  return useCallback(
    async (message, address, walletName) => {
      if (walletName === WalletTypes.METAMASK) {
        const signerAddress = getEvmSignerAddress(address);
        return await new Promise((resolve, reject) => {
          signMessage(
            { account: signerAddress, message },
            { onSuccess: resolve, onError: reject },
          );
        });
      }

      const extension = injectedWeb3?.[walletName];
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
    [injectedWeb3, signMessage],
  );
}
