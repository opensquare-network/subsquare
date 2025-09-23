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
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useMultisigListFetchFunc } from "next-common/components/multisigs/actions/composeCallPopup/fetchMultisigList";

const SignApprovePopupContext = createContext({
  visible: false,
  setVisible: () => {},
  currentMultisig: null,
  setCurrentMultisig: () => {},
  approveMultisig: () => {},
  isSubmitting: false,
});

export function SignApprovePopupProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [currentMultisig, setCurrentMultisig] = useState(null);
  const api = useContextApi();
  const address = useRealAddress();
  const { ss58Format } = useChainSettings();
  const fetchMultisigListFunc = useMultisigListFetchFunc();

  const getTxFunc = useCallback(() => {
    if (!api || !address || !currentMultisig) {
      return;
    }

    const {
      threshold,
      signatories,
      when: maybeTimepoint,
      callHash,
    } = currentMultisig;
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
  }, [api, address, currentMultisig, ss58Format]);

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock: () => {},
    onCancelled: () => {},
    onTxError: () => {},
    onFinalized: () => {
      fetchMultisigListFunc();
    },
  });

  const approveMultisig = useCallback(
    (multisig) => {
      if (multisig?.call) {
        setCurrentMultisig(multisig);
        setVisible(true);
      } else {
        setCurrentMultisig(multisig);
        doSubmit();
      }
    },
    [doSubmit],
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
        approveMultisig,
        isSubmitting,
        getTxFunc,
      }}
    >
      {children}
    </SignApprovePopupContext.Provider>
  );
}

export function useSignApprovePopup() {
  return useContext(SignApprovePopupContext);
}
