import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { sortAddresses } from "@polkadot/util-crypto";
import { isSameAddress } from "next-common/utils";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

const SignApprovePopupContext = createContext({
  visible: false,
  setVisible: () => {},
  currentMultisig: null,
  setCurrentMultisig: () => {},
  isSubmitting: false,
});

function InnerProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [currentMultisig, setCurrentMultisig] = useState(null);
  const api = useContextApi();
  const address = useRealAddress();
  const { ss58Format } = useChainSettings();

  const getTxFunc = useCallback(
    (multisig) => {
      if (!api || !address || !multisig) {
        return;
      }

      const {
        threshold,
        signatories,
        when: maybeTimepoint,
        callHash,
      } = multisig;

      const otherSignatories = signatories.filter(
        (item) => !isSameAddress(item, address),
      );
      const maxWeight = {
        refTime: 0,
        proofSize: 0,
      };

      return api.tx.multisig?.approveAsMulti(
        threshold,
        sortAddresses(otherSignatories, ss58Format),
        maybeTimepoint,
        callHash,
        maxWeight,
      );
    },
    [api, address, ss58Format],
  );

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
        getTxFunc,
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
