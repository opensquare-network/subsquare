import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState, createContext, useContext } from "react";
import { useVaultSignMessage } from "./useVaultSignMessage";

// Both popups import @polkadot/react-qr, which brings in a 600KB+ QR decoding
// library. This provider is mounted globally, so they have to be lazy loaded,
// otherwise every page pays for them on first load.
const VaultSignTxPopup = dynamicPopup(() =>
  import("next-common/components/polkadotVault/vaultSignTxPopup"),
);
const VaultSignMessagePopup = dynamicPopup(() =>
  import("next-common/components/polkadotVault/vaultSignMessagePopup"),
);

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
