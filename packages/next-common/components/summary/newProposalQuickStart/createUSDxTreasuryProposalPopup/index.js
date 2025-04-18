import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import CreateProposalSubmitButton, {
  useCreateProposalSubmitButton,
} from "../common/createProposalSubmitButton";
import { InfoMessage } from "next-common/components/setting/styled";
import AdvanceSettings from "../common/advanceSettings";
import BigNumber from "bignumber.js";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useUSDxTreasuryNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/newUSDxTreasuryProposalPopup";
import useUSDxBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useUSDxBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import useAutoSelectTreasuryTrackField from "../common/useAutoSelectTreasuryTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import { useStepContainer } from "next-common/context/stepContainer";
import Button from "next-common/lib/button";
import CircleStepper from "next-common/components/step";

function getTokenAmount(inputBalance) {
  // 1 DOT = 10 USDx
  const nativeTokenPrice = 10;
  const tokenAmount = new BigNumber(inputBalance || 0)
    .div(nativeTokenPrice)
    .toNumber();
  return tokenAmount;
}

export function NewUSDxTreasuryReferendumInnerPopupContent() {
  const { goBack } = useStepContainer();
  const {
    value: [inputBalance, symbol],
    component: usdxBalanceField,
  } = useUSDxBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(getTokenAmount(inputBalance));
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useUSDxTreasuryNotePreimageTx(inputBalance, beneficiary, validFrom, symbol);
  const { isLoading, component: submitButton } = useCreateProposalSubmitButton({
    trackId,
    enactment,
    encodedHash,
    encodedLength,
    notePreimageTx,
  });

  return (
    <>
      <CircleStepper
        steps={[
          {
            id: "provideInfo",
            label: "Provide the Info",
          },
          { id: "newReferendum", label: "New Referendum" },
        ]}
        currentStep={!notePreimageTx ? 0 : 1}
        loading={isLoading}
      />
      <SignerWithBalance />
      {usdxBalanceField}
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
      {notePreimageTx ? (
        <div className="bg-neutral200 rounded-lg px-4 py-2.5 text14Medium">
          After submitting the transaction, you&apos;ll be redirected to the
          referendum detail page to edit content.
        </div>
      ) : null}
      <div className="flex justify-between">
        <Button
          className={`border-neutral400 hover:border-neutral500 ${
            isLoading
              ? " cursor-not-allowed text-textDisabled border-neutral300"
              : ""
          }`}
          disabled={isLoading}
          onClick={goBack}
        >
          Previous
        </Button>
        {submitButton}
      </div>
    </>
  );
}

function PopupContent() {
  const {
    value: [inputBalance, symbol],
    component: usdxBalanceField,
  } = useUSDxBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(getTokenAmount(inputBalance));
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useUSDxTreasuryNotePreimageTx(inputBalance, beneficiary, validFrom, symbol);

  return (
    <>
      <SignerWithBalance />
      {usdxBalanceField}
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

export function NewUSDxTreasuryReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Create USDx Treasury Proposal" onClose={onClose}>
      <PopupContent />
    </Popup>
  );
}
