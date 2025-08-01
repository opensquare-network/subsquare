import { createContext, useContext, useState, useEffect } from "react";

const SignSubmitPopupContext = createContext({
  visible: false,
  setVisible: () => {},
  currentMultisig: null,
  setCurrentMultisig: () => {},
});

export function SignSubmitPopupProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [currentMultisig, setCurrentMultisig] = useState(null);

  useEffect(() => {
    if (!visible && currentMultisig) {
      setCurrentMultisig(null);
    }
  }, [visible, currentMultisig]);

  return (
    <SignSubmitPopupContext.Provider
      value={{
        visible,
        setVisible,
        currentMultisig,
        setCurrentMultisig,
      }}
    >
      {children}
    </SignSubmitPopupContext.Provider>
  );
}

export function useSignSubmitPopup() {
  return useContext(SignSubmitPopupContext);
}
