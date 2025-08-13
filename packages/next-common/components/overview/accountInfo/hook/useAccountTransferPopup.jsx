import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useContextApi } from "next-common/context/api";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { useChainSettings } from "next-common/context/chain";
import { useTransferAmount } from "next-common/components/popup/fields/useTransferAmount";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import { toPrecision } from "next-common/utils";
import BigNumber from "bignumber.js";
import { SystemWarning } from "@osn/icons/subsquare";
import { WarningMessage } from "next-common/components/setting/styled";
import { querySystemAccountBalance } from "next-common/utils/hooks/useAddressBalance";

function useDestinationWarningCheck(amount, address) {
  const [showDestinationWarning, setShowDestinationWarning] = useState(false);
  const { decimals } = useChainSettings();
  const api = useContextApi();
  const existentialDeposit = useQueryExistentialDeposit();

  useEffect(() => {
    if (
      !amount ||
      !address ||
      !existentialDeposit ||
      new BigNumber(amount).isZero() ||
      !api
    ) {
      setShowDestinationWarning(false);
      return;
    }

    querySystemAccountBalance(api, address).then((balance) => {
      if (
        new BigNumber(balance).isZero() &&
        new BigNumber(amount).lt(
          new BigNumber(toPrecision(existentialDeposit, decimals)),
        )
      ) {
        setShowDestinationWarning(true);
        return;
      }

      setShowDestinationWarning(false);
    });
  }, [api, decimals, existentialDeposit, amount, address]);

  return showDestinationWarning;
}

function DestinationTransferWarning() {
  return (
    <WarningMessage className="flex justify-center gap-x-2">
      <SystemWarning className="w-5 h-5 flex-shrink-0" />
      <span>
        The amount is less than the existential deposit and the target address
        may not receive it.
      </span>
    </WarningMessage>
  );
}

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
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const { value: balance, loading } = useSubBalanceInfo(address);
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
    value: transferAmount,
  } = useTransferAmount({
    transferrable: balance?.transferrable,
    decimals,
    symbol,
    isLoading: loading,
    transferFromAddress: address,
  });
  const { value: transferToAddress, component: transferToAddressField } =
    useAddressComboField({ title: "To" });

  const showDestinationWarning = useDestinationWarningCheck(
    transferAmount,
    transferToAddress,
  );

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

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Transfer successfully"));
  }, [dispatch]);

  return (
    <>
      <SignerWithBalance />
      {transferToAddressField}
      {transferAmountField}
      {showDestinationWarning && <DestinationTransferWarning />}
      <AdvanceSettings>
        <ExistentialDeposit destApi={api} title="Existential Deposit" />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          onInBlock={onInBlock}
        />
      </div>
    </>
  );
}

function AccountTransferPopup(props) {
  return (
    <PopupWithSigner title="Transfer" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
