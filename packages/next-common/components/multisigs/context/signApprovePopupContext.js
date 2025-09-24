import { createContext, useContext, useState, useEffect } from "react";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

const SignApprovePopupContext = createContext({
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
    <SignApprovePopupContext.Provider
      value={{
        visible,
        setVisible,
        currentMultisig,
        setCurrentMultisig,
      }}
    >
      {children}
    </SignApprovePopupContext.Provider>
  );
}

export function SignApprovePopupProvider({ children }) {
  return (
    <SignerPopupWrapper>
      <InnerProvider>{children}</InnerProvider>
    </SignerPopupWrapper>
  );
}

export function useSignApprovePopup() {
  return useContext(SignApprovePopupContext);
}
