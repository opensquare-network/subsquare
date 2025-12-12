import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Popup from "next-common/components/popup/wrapper/Popup";
import PrimaryButton from "next-common/lib/button/primary";
import { usePopupOnClose } from "next-common/context/popup";
import { useStakingLedgers } from "next-common/hooks/useStakingLedgers";
import ValidatorsList from "./validatorsList";
import Loading from "next-common/components/loading";
import { useValidatorsWithStatus } from "next-common/hooks/staking/useValidatorWithStatus";

function NomineeListPopupContent({ nominator }) {
  const onClose = usePopupOnClose();
  const { nominators, loading: isNomineesLoading } =
    useStakingLedgers(nominator);
  const nominees = nominators?.targets || [];

  const { active, loading: isNomineesStatusLoading } = useValidatorsWithStatus(
    nominator,
    nominees || [],
  );

  const loading = isNomineesLoading || isNomineesStatusLoading;

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
        nominees={nominees}
        activeNominees={active || []}
        isLoading={loading}
      />
      <div className="flex justify-end">
        <PrimaryButton onClick={onClose}>Close</PrimaryButton>
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
