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
import BalanceField from "next-common/components/popup/fields/balanceField";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import { useOnchainData } from "next-common/context/post";

function useFeeField({ balance, decimals }) {
  const [inputBalance, setInputBalance] = useState("");

  const getCheckedValue = useCallback(() => {
    return checkTransferAmount({
      transferAmount: inputBalance,
      decimals,
      transferrable: balance,
    });
  }, [inputBalance, decimals, balance]);

  return {
    getCheckedValue,
    value: inputBalance,
    component: (
      <BalanceField
        title="Fee"
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
      />
    ),
  };
}

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
  const { getCheckedValue: getCheckedFee, component: feeField } = useFeeField({
    balance: balance?.balance,
    decimals,
  });

  const { value: curator, component: curatorSelect } = useAddressComboField({
    title: "Curator",
  });

  const { parentBountyId, index: childBountyId } = useOnchainData();

  const getTxFunc = useCallback(() => {
    if (!curator) {
      dispatch(newErrorToast("Please enter the recipient address"));
      return;
    }

    let fee;
    try {
      fee = getCheckedFee();
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    // TODO: call tx api.
    // return api.tx.childBounties?.proposeCurator(
    //   parentBountyId,
    //   childBountyId,
    //   curator,
    //   fee,
    // );
  }, [dispatch, api, curator, getCheckedFee]);

  return (
    <>
      <Signer
        balanceName="Available"
        signerBalance={balance?.balance}
        isSignerBalanceLoading={loading}
      />
      {curatorSelect}
      {feeField}
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
