import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useContextApi } from "next-common/context/api";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { useChainSettings } from "next-common/context/chain";
import { useTransferAmount } from "next-common/components/popup/fields/useTransferAmount";

export function useAccountTransferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const component = isOpen && (
    <AccountTransferPopup onClose={() => setIsOpen(false)} />
  );

  return {
    showPopup: () => setIsOpen(true),
    component,
  };
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const { value: balance, loading } = useSubBalanceInfo(address);
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useTransferAmount({
    transferrable: balance?.transferrable,
    decimals,
    symbol,
    isLoading: loading,
    transferFromAddress: address,
  });
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
        <ExistentialDeposit destApi={api} title="Existential Deposit" />
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
