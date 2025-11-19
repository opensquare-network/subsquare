import { createContext, useContext, useState, useEffect } from "react";

const TransferPopupContext = createContext({
  visible: false,
  setVisible: () => {},
  currentAsset: null,
  setCurrentAsset: () => {},
});

export function TransferPopupProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);

  useEffect(() => {
    if (!visible && currentAsset) {
      setCurrentAsset(null);
    }
  }, [visible, currentAsset]);

  return (
    <TransferPopupContext.Provider
      value={{
        visible,
        setVisible,
        currentAsset,
        setCurrentAsset,
      }}
    >
      {children}
    </TransferPopupContext.Provider>
  );
}

export function useTransferPopup() {
  return useContext(TransferPopupContext);
}
