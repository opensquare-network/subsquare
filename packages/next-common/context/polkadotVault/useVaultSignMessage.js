import { useState, useCallback, useRef, useEffect } from "react";
import { usePolkadotVault } from "next-common/context/polkadotVault";
import { isSameAddress } from "next-common/utils";

export function useVaultSignMessage() {
  const { accounts } = usePolkadotVault();
  const [isSigning, setIsSigning] = useState(false);
  const [signingRequest, setSigningRequest] = useState(null);

  const promiseRef = useRef(null);

  const signMessage = useCallback(
    ({ address, message }) => {
      if (!address) {
        return Promise.reject(new Error("Address is empty"));
      }

      const account = accounts.find((account) =>
        isSameAddress(account.address, address),
      );
      if (!account) {
        return Promise.reject(new Error("Account not found"));
      }

      const genesisHash = account.meta?.genesisHash;
      if (!genesisHash) {
        return Promise.reject(new Error("GenesisHash is empty"));
      }

      if (!message) {
        return Promise.reject(new Error("Message is empty"));
      }

      if (promiseRef.current) {
        promiseRef.current.reject(new Error("New signing request started"));
        promiseRef.current = null;
      }

      setIsSigning(true);

      return new Promise((resolve, reject) => {
        promiseRef.current = { resolve, reject };

        setSigningRequest({
          address,
          genesisHash,
          message,
        });
      });
    },
    [accounts],
  );

  const completeSignature = useCallback((result) => {
    if (promiseRef.current) {
      promiseRef.current.resolve(result);
      promiseRef.current = null;
      setIsSigning(false);
      setSigningRequest(null);
    }
  }, []);

  const cancelSignature = useCallback((error) => {
    if (promiseRef.current) {
      promiseRef.current.reject(error);
      promiseRef.current = null;
      setIsSigning(false);
      setSigningRequest(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (promiseRef.current) {
        promiseRef.current.reject(new Error("Unmounted"));
        promiseRef.current = null;
      }
    };
  }, []);

  return {
    signMessage,
    isSigning,
    signingRequest,
    completeSignature,
    cancelSignature,
  };
}
