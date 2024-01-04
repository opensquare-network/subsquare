import { useCallback } from "react";
import { stringToHex } from "@polkadot/util";
import { personalSign } from "next-common/utils/metamask";
import WalletTypes from "next-common/utils/consts/walletTypes";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";

export function useSignMessage() {
  const { injectedWeb3 } = useInjectedWeb3();

  return useCallback(
    async (message, address, walletName) => {
      if (walletName === WalletTypes.METAMASK) {
        return await personalSign(stringToHex(message), address);
      }

      const extension = injectedWeb3?.[walletName];
      if (!extension) {
        throw new Error("Wallet not found");
      }

      const wallet = await extension.enable("subsquare");
      const { signature } = await wallet.signer.signRaw({
        type: "bytes",
        data: stringToHex(message),
        address,
      });

      return signature;
    },
    [injectedWeb3],
  );
}
