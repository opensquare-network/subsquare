import { useMyNativeAsset } from "next-common/components/assets/useMyAssets";
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
import useTransferAmount from "next-common/components/assets/transferPopup/useTransferAmount";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";

export function useAccountTransferPopup() {
  const nativeAsset = useMyNativeAsset();
  const [isOpen, setIsOpen] = useState(false);
  const component = isOpen && (
    <AccountTransferPopup
      asset={nativeAsset?.value}
      onClose={() => setIsOpen(false)}
    />
  );

  return {
    showPopup: () => setIsOpen(true),
    component,
  };
}

function PopupContent() {
  const { asset, onClose } = usePopupParams();
  const api = useContextApi();
  const address = useRealAddress();
  const dispatch = useDispatch();
  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useTransferAmount({ asset, transferFromAddress: address });
  const { value: transferToAddress, component: transferToAddressField } =
    useAddressComboField({ title: "To" });

  const getTxFunc = useCallback(() => {
    if (!transferToAddress) {
      dispatch(newErrorToast("Please enter the recipient address"));
      return;
    }

    let amount;
    try {
      amount = getCheckedTransferAmount();
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    return api.tx.balances?.transferKeepAlive(transferToAddress, amount);
  }, [dispatch, api, transferToAddress, getCheckedTransferAmount]);

  return (
    <>
      <Signer />
      {transferToAddressField}
      {transferAmountField}
      <AdvanceSettings>
        <ExistentialDeposit destApi={api} text="Existential Deposit" />
      </AdvanceSettings>
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

function AccountTransferPopup(props) {
  return (
    <PopupWithSigner title="Transfer" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
