import VaultSignTxPopup from "next-common/components/polkadotVault/vaultSignTxPopup";
import VaultSignMessagePopup from "next-common/components/polkadotVault/vaultSignMessagePopup";
import { useState, createContext, useContext, useCallback } from "react";

const VaultScanContext = createContext();
let qrId = 0;

export function VaultSignerProvider({ children }) {
  const [txOptions, sendVaultTx] = useState({});
  const [messageOptions, setMessageOptions] = useState(null);

  const signMessage = useCallback(({ address, genesisHash, message }) => {
    return new Promise((resolve, reject) => {
      if (!address) {
        return reject(new Error("Address is empty"));
      }
      if (!genesisHash) {
        return reject(new Error("GenesisHash is empty"));
      }
      if (!message) {
        return reject(new Error("Message is empty"));
      }

      setMessageOptions({
        resolve,
        reject,
        address,
        genesisHash,
        message,
      });
    });
  }, []);

  return (
    <VaultScanContext.Provider
      value={{
        sendVaultTx: (data) => {
          sendVaultTx(data);
          ++qrId;
        },
        signMessage,
      }}
    >
      {txOptions.tx && (
        <VaultSignTxPopup
          key={qrId}
          qrId={qrId}
          {...txOptions}
          onClose={() => sendVaultTx({})}
        />
      )}
      {messageOptions && (
        <VaultSignMessagePopup
          {...messageOptions}
          onClose={() => setMessageOptions(null)}
        />
      )}
      {children}
    </VaultScanContext.Provider>
  );
}
export function useVaultSigner() {
  const context = useContext(VaultScanContext);
  return context;
}
