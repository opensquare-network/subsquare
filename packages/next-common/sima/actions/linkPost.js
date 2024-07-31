import { useConnectedAccount } from "next-common/context/connectedAccount";
import nextApi from "next-common/services/nextApi";
import { useCallback } from "react";

export function useGetSimaUserDiscussions() {
  const connectedAccount = useConnectedAccount();

  return useCallback(async () => {
    if (!connectedAccount) {
      throw new Error("Wallet is not connected yet");
    }
    return await nextApi.fetch(
      `users/${connectedAccount?.address}/all-sima-posts`,
    );
  }, [connectedAccount]);
}
