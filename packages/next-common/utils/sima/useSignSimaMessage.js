import { isEthereumAddress } from "@polkadot/util-crypto";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import { useCallback } from "react";

export default function useSignSimaMessage() {
  const { ensureConnect } = useEnsureLogin();
  const signMessage = useSignMessage();

  return useCallback(
    async (entity) => {
      const connectedAccount = await ensureConnect();
      if (!connectedAccount) {
        throw new Error("Cancelled");
      }

      let address = connectedAccount.address;
      const signerWallet = connectedAccount.wallet;
      if (signerWallet === "metamask" && !isEthereumAddress(address)) {
        address = connectedAccount.evmAddress || address;
      }
      const signature = await signMessage(
        JSON.stringify(entity),
        address,
        signerWallet,
      );
      return {
        entity,
        address,
        signature,
        signerWallet,
      };
    },
    [ensureConnect, signMessage],
  );
}
