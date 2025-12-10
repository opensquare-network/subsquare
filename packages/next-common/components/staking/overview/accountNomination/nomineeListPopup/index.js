import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Popup from "next-common/components/popup/wrapper/Popup";
import PrimaryButton from "next-common/lib/button/primary";
import { usePopupOnClose } from "next-common/context/popup";
import { useStakingLedgers } from "next-common/hooks/useStakingLedgers";
import ValidatorsList from "./validatorsList";
import Loading from "next-common/components/loading";

function NomineeListPopupContent({ nominator }) {
  const onClose = usePopupOnClose();
  const { nominators, loading } = useStakingLedgers(nominator);

  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <Loading size={16} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 text14Medium">
      <ValidatorsList
        nominees={nominators?.targets || []}
        isLoading={loading}
      />
      <div className="flex justify-end">
        <PrimaryButton onClick={onClose}>Confirm</PrimaryButton>
      </div>
    </div>
  );
}

export default function NomineeListPopup({ onClose, nominator }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Nominees List" onClose={onClose}>
        <NomineeListPopupContent nominator={nominator} />
      </Popup>
    </SignerPopupWrapper>
  );
}
