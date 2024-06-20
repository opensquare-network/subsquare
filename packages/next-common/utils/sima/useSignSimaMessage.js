import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useSignMessage } from "next-common/hooks/useSignMessage";
import { useCallback } from "react";
import { useConnectedAccount } from "next-common/context/connectedAccount";

export default function useSignSimaMessage() {
  const { ensureConnect } = useEnsureLogin();
  const signMessage = useSignMessage();
  const connectedAccount = useConnectedAccount();

  return useCallback(
    async (entity) => {
      if (!ensureConnect()) {
        return;
      }

      const address = connectedAccount.address;
      const signerWallet = connectedAccount.wallet;
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
    [connectedAccount, ensureConnect, signMessage],
  );
}
