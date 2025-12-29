import VaultSignTxPopup from "next-common/components/polkadotVault/vaultSignTxPopup";
import VaultSignMessagePopup from "next-common/components/polkadotVault/vaultSignMessagePopup";
import { useState, createContext, useContext, useCallback } from "react";
import { usePolkadotVault } from "next-common/context/polkadotVault";
import { isSameAddress } from "next-common/utils";

const VaultScanContext = createContext();
let qrId = 0;

export function VaultSignerProvider({ children }) {
  const [txOptions, setTxOptions] = useState({});
  const [messageOptions, setMessageOptions] = useState(null);
  const { accounts } = usePolkadotVault();

  const signMessage = useCallback(
    ({ address, message }) => {
      return new Promise((resolve, reject) => {
        if (!address) {
          return reject(new Error("Address is empty"));
        }
        const account = accounts.find((account) =>
          isSameAddress(account.address, address),
        );
        if (!account) {
          return reject(new Error("Account not found"));
        }
        const genesisHash = account.meta?.genesisHash;
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
    },
    [accounts],
  );

  return (
    <VaultScanContext.Provider
      value={{
        sendVaultTx: (data) => {
          setTxOptions(data);
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
          onClose={() => setTxOptions({})}
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
