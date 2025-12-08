import VaultSignerPopup from "next-common/components/polkadotVault/vaultSignerPopup";
import { useState, createContext, useContext } from "react";

const VaultScanContext = createContext();
let qrId = 0;

export function VaultSignerProvider({ children }) {
  const [options, setOptions] = useState({});

  return (
    <VaultScanContext.Provider
      value={{
        setOptions: (data) => {
          setOptions(data);
          ++qrId;
        },
      }}
    >
      <VaultSignerPopup
        qrId={qrId}
        {...options}
        onClose={() => setOptions({})}
      />
      {children}
    </VaultScanContext.Provider>
  );
}
export function useVaultSigner() {
  const context = useContext(VaultScanContext);
  return context;
}
