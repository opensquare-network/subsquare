import VaultSignTxPopup from "next-common/components/polkadotVault/vaultSignTxPopup";
import VaultSignMessagePopup from "next-common/components/polkadotVault/vaultSignMessagePopup";
import { useState, createContext, useContext } from "react";
import { useVaultSignMessage } from "./useVaultSignMessage";

const VaultScanContext = createContext();
let qrId = 0;

export function VaultSignerProvider({ children }) {
  const [txOptions, setTxOptions] = useState(null);

  const {
    signMessage,
    isSigning,
    signingRequest,
    completeSignature,
    cancelSignature,
  } = useVaultSignMessage();

  return (
    <VaultScanContext.Provider
      value={{
        sendVaultTx: (data) => {
          setTxOptions(data);
          ++qrId;
        },
        isSigning,
        signMessage,
      }}
    >
      {txOptions?.tx && (
        <VaultSignTxPopup
          key={qrId}
          qrId={qrId}
          {...txOptions}
          onClose={() => setTxOptions(null)}
        />
      )}

      {signingRequest && (
        <VaultSignMessagePopup
          {...signingRequest}
          onComplete={completeSignature}
          onCancel={cancelSignature}
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
