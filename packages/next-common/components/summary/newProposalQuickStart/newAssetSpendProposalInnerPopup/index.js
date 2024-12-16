import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import Popup from "next-common/components/popup/wrapper/Popup";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import useTrackField from "../common/useTrackField";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import { InfoMessage } from "next-common/components/setting/styled";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import { useDefaultTrackId } from "../../newProposalPopup/useTrackDetail";
import { useSubmissionDeposit } from "../common/useSubmissionDeposit";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import Tooltip from "next-common/components/tooltip";
import { useAssetHubNativeTreasuryNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/newFellowshipTreasuryProposalPopup";

function CreateProposalSubmitButtonWithRankCheck({
  trackId,
  enactment,
  encodedHash,
  encodedLength,
  notePreimageTx,
}) {
  const { members } = useFellowshipCoreMembers();
  const signerAccount = useSignerAccount();
  const realAddress = signerAccount?.realAddress;
  const me = find(members, { address: realAddress });

  const myRankOk = me && me.rank >= 3;

  const submitButton = (
    <CreateProposalSubmitButton
      disabled={!myRankOk}
      trackId={trackId}
      enactment={enactment}
      encodedHash={encodedHash}
      encodedLength={encodedLength}
      notePreimageTx={notePreimageTx}
    />
  );

  if (myRankOk) {
    return submitButton;
  }

  return (
    <Tooltip content="Only available to the members with rank >= 3">
      {submitButton}
    </Tooltip>
  );
}

export function NewAssetSpendProposalInnerPopup() {
  const defaultTrackId = useDefaultTrackId();

  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: trackId, component: trackField } =
    useTrackField(defaultTrackId);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const { value: validFrom, component: validFromField } = useValidFromField();
  const { component: submissionDepositField } = useSubmissionDeposit();

  const { encodedHash, encodedLength, notePreimageTx } =
    useAssetHubNativeTreasuryNotePreimageTx(
      inputBalance,
      beneficiary,
      validFrom,
    );

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose}>
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
        {submissionDepositField}
      </AdvanceSettings>
      <div className="flex justify-end">
        <CreateProposalSubmitButtonWithRankCheck
          trackId={trackId}
          enactment={enactment}
          encodedHash={encodedHash}
          encodedLength={encodedLength}
          notePreimageTx={notePreimageTx}
        />
      </div>
    </Popup>
  );
}
