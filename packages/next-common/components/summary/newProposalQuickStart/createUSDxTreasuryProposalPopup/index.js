import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import { InfoMessage } from "next-common/components/setting/styled";
import AdvanceSettings from "../common/advanceSettings";
import BigNumber from "bignumber.js";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useUSDxTreasuryNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/newUSDxTreasuryProposalPopup";
import useUSDxBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useUSDxBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import useAutoSelectTreasuryTrackField from "../common/useAutoSelectTreasuryTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";

function getTokenAmount(inputBalance) {
  // 1 DOT = 10 USDx
  const nativeTokenPrice = 10;
  const tokenAmount = new BigNumber(inputBalance || 0)
    .div(nativeTokenPrice)
    .toNumber();
  return tokenAmount;
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
      <SignerWithBalance title="Origin" />
      {usdxBalanceField}
      <div className="flex flex-col gap-[8px]">
        {beneficiaryField}
        <InfoMessage>Please fill the address from AssetHub</InfoMessage>
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
    <Popup
      title="Create USDx Treasury Proposal"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
      <AssetHubApiProvider>
        <PopupContent />
      </AssetHubApiProvider>
    </Popup>
  );
}
