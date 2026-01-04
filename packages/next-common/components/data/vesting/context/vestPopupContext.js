import { createContext, useContext, useState, useCallback } from "react";

const VestPopupContext = createContext(null);

export function VestPopupProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [account, setAccount] = useState(null);
  const [unlockable, setUnlockable] = useState(null);

  const showVestPopup = useCallback((vestAccount, vestUnlockable) => {
    setAccount(vestAccount);
    setUnlockable(vestUnlockable);
    setVisible(true);
  }, []);

  const hideVestPopup = useCallback(() => {
    setVisible(false);
    setAccount(null);
    setUnlockable(null);
  }, []);

  return (
    <VestPopupContext.Provider
      value={{
        visible,
        account,
        unlockable,
        showVestPopup,
        hideVestPopup,
      }}
    >
      {children}
    </VestPopupContext.Provider>
  );
}

export function useVestPopup() {
  const context = useContext(VestPopupContext);
  return context;
}
