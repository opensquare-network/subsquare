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
import { useOnchainData } from "next-common/context/post";
import useFeeAmount from "./useFeeAmount";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";

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
  const { value: signerBalance, loading: signerBalanceLoading } =
    useSubBalanceInfo(address);
  const api = useContextApi();
  const dispatch = useDispatch();

  const {
    parentBountyId,
    index: childBountyId,
    address: metadataAddress,
  } = useOnchainData();
  const { balance: metadataBalance, isLoading: metadataBalanceLoading } =
    useSubAddressBalance(metadataAddress);

  const { getCheckedValue: getCheckedFee, component: feeField } = useFeeAmount({
    balance: metadataBalance,
    decimals,
    symbol,
    address,
    isLoading: metadataBalanceLoading,
  });

  const { value: curator, component: curatorSelect } = useAddressComboField({
    title: "Curator",
  });

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

    return api.tx.childBounties?.proposeCurator(
      parentBountyId,
      childBountyId,
      curator,
      fee,
    );
  }, [dispatch, api, curator, getCheckedFee, parentBountyId, childBountyId]);

  return (
    <>
      <Signer
        balanceName="Available"
        signerBalance={signerBalance?.balance}
        isSignerBalanceLoading={signerBalanceLoading}
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
