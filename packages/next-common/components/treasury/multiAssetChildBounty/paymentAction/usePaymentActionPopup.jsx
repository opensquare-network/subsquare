import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useState } from "react";
import { useOnchainData } from "next-common/context/post";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";

function PopupContent({ action }) {
  const api = useContextApi();
  const { parentBountyId, childBountyId } = useOnchainData();
  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      const txApi = api?.tx?.multiAssetBounties;
      if (!txApi?.[action.method]) {
        toastError(`${action.title} transaction is unavailable`);
        return null;
      }

      return txApi[action.method](parentBountyId, childBountyId);
    },
    [api, action, parentBountyId, childBountyId],
  );

  return (
    <>
      <SignerWithBalance />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton title="Confirm" getTxFunc={getTxFuncForSubmit} />
    </>
  );
}

function PaymentActionPopup({ action, ...props }) {
  return (
    <PopupWithSigner title={action.title} {...props}>
      <PopupContent action={action} />
    </PopupWithSigner>
  );
}

export default function usePaymentActionPopup(action) {
  const [isOpen, setIsOpen] = useState(false);

  return {
    showPopup: () => setIsOpen(true),
    popup:
      isOpen && action ? (
        <PaymentActionPopup action={action} onClose={() => setIsOpen(false)} />
      ) : null,
  };
}
