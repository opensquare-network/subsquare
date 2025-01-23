import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import { InfoMessage } from "next-common/components/setting/styled";
import AdvanceSettings from "../common/advanceSettings";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useSpendDotOnAssetHubPreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/spendDotOnAssetHubPopup";
import useAssetHubDotBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useAssetHubDotBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import useAutoSelectTreasuryTrackField from "../common/useAutoSelectTreasuryTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";

function PopupContent() {
  const { value: inputBalance, component: balanceField } =
    useAssetHubDotBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(inputBalance);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useSpendDotOnAssetHubPreimageTx(inputBalance, beneficiary, validFrom);

  return (
    <>
      <SignerWithBalance />
      {balanceField}
      <div className="flex flex-col gap-[8px]">
        {beneficiaryField}
        <InfoMessage>
          Please input an AssetHub address as the beneficiary
        </InfoMessage>
      </div>
      {trackField}
      <AdvanceSettings>
        {validFromField}
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="flex justify-end">
        <CreateProposalSubmitButton
          trackId={trackId}
          enactment={enactment}
          encodedHash={encodedHash}
          encodedLength={encodedLength}
          notePreimageTx={notePreimageTx}
        />
      </div>
    </>
  );
}

export function SpendDotOnAssetHubReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Spend DOT on Asset Hub" onClose={onClose}>
      <PopupContent />
    </Popup>
  );
}
