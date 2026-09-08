import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useState } from "react";
import { useOnchainData } from "next-common/context/post";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";

function PopupContent() {
  const api = useContextApi();
  const { parentBountyId, childBountyId } = useOnchainData();
  const { value: curator, component: curatorSelect } = useAddressComboField({
    title: "Curator",
  });

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!curator) {
        toastError("Curator address is required");
        return null;
      }

      if (!api?.tx?.multiAssetBounties?.proposeCurator) {
        toastError("Propose curator transaction is unavailable");
        return null;
      }

      return api.tx.multiAssetBounties.proposeCurator(
        parentBountyId,
        childBountyId,
        curator,
      );
    },
    [api, parentBountyId, childBountyId, curator],
  );

  return (
    <>
      <SignerWithBalance />
      {curatorSelect}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFuncForSubmit}
        />
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
    showPopup: () => setIsOpen(true),
    popup: isOpen ? (
      <ProposeCuratorPopup onClose={() => setIsOpen(false)} />
    ) : null,
  };
}
