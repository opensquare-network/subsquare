import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
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
  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      const txApi = api?.tx?.multiAssetBounties;
      if (!txApi?.acceptCurator) {
        toastError("Accept curator transaction is unavailable");
        return null;
      }

      return txApi.acceptCurator(parentBountyId, childBountyId);
    },
    [api, parentBountyId, childBountyId],
  );

  return (
    <>
      <SignerWithBalance />
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

function AcceptCuratorPopup(props) {
  return (
    <PopupWithSigner title="Accept Curator" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}

export default function useAcceptCuratorPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    showPopup: () => setIsOpen(true),
    popup: isOpen ? (
      <AcceptCuratorPopup onClose={() => setIsOpen(false)} />
    ) : null,
  };
}
