import { createContext, useContext, useState, useEffect } from "react";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

const SignCancelPopupContext = createContext({
  visible: false,
  setVisible: () => {},
  currentMultisig: null,
  setCurrentMultisig: () => {},
});

function InnerProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [currentMultisig, setCurrentMultisig] = useState(null);

  useEffect(() => {
    if (!visible && currentMultisig) {
      setCurrentMultisig(null);
    }
  }, [visible, currentMultisig]);

  return (
    <SignCancelPopupContext.Provider
      value={{
        visible,
        setVisible,
        currentMultisig,
        setCurrentMultisig,
      }}
    >
      {children}
    </SignCancelPopupContext.Provider>
  );
}

export function SignCancelPopupProvider({ children }) {
  return (
    <SignerPopupWrapper>
      <InnerProvider>{children}</InnerProvider>
    </SignerPopupWrapper>
  );
}

export function useSignCancelPopup() {
  return useContext(SignCancelPopupContext);
}
