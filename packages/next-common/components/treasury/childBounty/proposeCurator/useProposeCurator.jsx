import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useCallback, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import useFeeAmount from "./useFeeAmount";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

function PopupContent() {
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const api = useContextApi();

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
      throw new Error("Curator address is required");
    }

    const fee = getCheckedFee();

    return api.tx.childBounties?.proposeCurator(
      parentBountyId,
      childBountyId,
      curator,
      fee,
    );
  }, [curator, getCheckedFee, parentBountyId, childBountyId, api]);

  return (
    <>
      <SignerWithBalance />
      {curatorSelect}
      {feeField}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton title="Confirm" getTxFunc={getTxFunc} />
      </div>
    </>
  );
}

function ProposeCuratorPopup(props) {
  return (
    <PopupWithSigner title="Propose Curator" {...props}>
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
