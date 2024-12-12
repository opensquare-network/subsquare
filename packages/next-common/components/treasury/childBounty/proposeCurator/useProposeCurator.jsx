import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams, useSignerAccount } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useContextApi } from "next-common/context/api";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import useFeeAmount from "./useFeeAmount";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

function PopupContent() {
  const { onClose } = usePopupParams();
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const api = useContextApi();
  const dispatch = useDispatch();

  const {
    parentBountyId,
    index: childBountyId,
    address: childBountyAddress,
  } = useOnchainData();
  const { balance: metadataBalance, isLoading: metadataBalanceLoading } =
    useSubAddressBalance(childBountyAddress);

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
      dispatch(newErrorToast("Curator address is required"));
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
  }, [curator, getCheckedFee, parentBountyId, childBountyId, api, dispatch]);

  return (
    <>
      <SignerWithBalance />
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

export default function useProposeCuratorPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    showPopupFn: () => setIsOpen(true),
    component: isOpen ? (
      <ProposeCuratorPopup onClose={() => setIsOpen(false)} />
    ) : null,
  };
}
