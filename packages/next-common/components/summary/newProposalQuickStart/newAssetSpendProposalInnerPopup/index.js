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
import useAutoSelectTreasuryTrackField, {
  AutoSelectTreasuryTrackErrors,
} from "../common/useAutoSelectTreasuryTrackField";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import { useDefaultTrackId } from "../../newProposalPopup/useTrackDetail";
import { useSubmissionDeposit } from "../common/useSubmissionDeposit";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import Tooltip from "next-common/components/tooltip";
import { useAssetHubNativeTreasuryNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/newFellowshipTreasuryProposalPopup";
import { find } from "lodash-es";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import ErrorMessage from "next-common/components/styled/errorMessage";

function CreateProposalSubmitButtonWithRankCheck({
  trackId,
  enactment,
  encodedHash,
  encodedLength,
  notePreimageTx,
  disabled,
}) {
  const { members = [] } = useFellowshipCollectiveMembers();
  const signerAccount = useSignerAccount();
  const realAddress = signerAccount?.realAddress;
  const me = find(members, { address: realAddress });

  const myRankOk = me && me.rank >= 3;

  const submitButton = (
    <CreateProposalSubmitButton
      disabled={!myRankOk || disabled}
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
  const chain = useChain();
  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const {
    value: trackId,
    component: trackField,
    error,
  } = useAutoSelectTreasuryTrackField(inputBalance, defaultTrackId);
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

  const overMax =
    isCollectivesChain(chain) &&
    error === AutoSelectTreasuryTrackErrors.OverMax;

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose}>
      <SignerWithBalance supportedMultisig={false} />
      {balanceField}
      <div className="flex flex-col gap-[8px]">{beneficiaryField}</div>
      {trackField}
      <AdvanceSettings>
        {validFromField}
        {enactmentField}
        {submissionDepositField}
      </AdvanceSettings>
      {overMax && (
        <ErrorMessage>
          Over the maximum value fellowship referenda can approve.
        </ErrorMessage>
      )}
      <div className="flex justify-end">
        <CreateProposalSubmitButtonWithRankCheck
          trackId={trackId}
          enactment={enactment}
          encodedHash={encodedHash}
          encodedLength={encodedLength}
          notePreimageTx={notePreimageTx}
          disabled={overMax}
        />
      </div>
    </Popup>
  );
}
