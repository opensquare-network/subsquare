import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useContextApi } from "next-common/context/api";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { useChainSettings } from "next-common/context/chain";

export function useProposeCuratorPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const component = isOpen && (
    <ProposeCuratorPopup onClose={() => setIsOpen(false)} />
  );

  return {
    showPopup: () => setIsOpen(true),
    component,
  };
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const { decimals, symbol } = useChainSettings();
  const address = useRealAddress();
  const { value: balance, loading } = useSubBalanceInfo(address);
  const api = useContextApi();
  const dispatch = useDispatch();

  const { value: curator, component: curatorSelect } = useAddressComboField({
    title: "Curator",
  });

  const getTxFunc = useCallback(() => {
    // TODO: getTxFunc
  }, []);

  return (
    <>
      <Signer />
      {curatorSelect}
      {/* fee field*/}
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          onClose={onClose}
        />
      </div>
    </>
  );
}

function ProposeCuratorPopup(props) {
  return (
    <PopupWithSigner title="Propose Curator" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
