import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useLocalTreasuryNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/newLocalTreasuryProposalPopup";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import Chains from "next-common/utils/consts/chains";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { useListPageType, usePageProps } from "next-common/context/page";
import { useChain } from "next-common/context/chain";
import useTrackField from "../common/useTrackField";

export function NewAssetSpendProposalInnerPopup() {
  const listPageType = useListPageType();
  const chain = useChain();

  let pallet = "referenda";
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    pallet = "fellowshipReferenda";
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    pallet = "ambassadorReferenda";
  }

  const { tracks, fellowshipTracks, ambassadorTracks } = usePageProps();

  let trackList;
  let defaultTrackId;

  if (listPageType === listPageCategory.REFERENDA) {
    trackList = tracks;
    defaultTrackId = tracks[0].id;
    if ([Chains.polkadot, Chains.kusama].includes(chain)) {
      defaultTrackId = 2; // Wish for Change
    }
  } else if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    trackList = fellowshipTracks;
    defaultTrackId = 3; // fellows
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    trackList = ambassadorTracks;
    defaultTrackId = trackList[0].id;
  }

  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: trackId, component: trackField } =
    useTrackField(defaultTrackId);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useLocalTreasuryNotePreimageTx(inputBalance, beneficiary);

  return (
    <Popup
      title="Create Treasury Proposal"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
      <SignerWithBalance title="Origin" />
      {balanceField}
      {beneficiaryField}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit pallet={pallet} />
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
    </Popup>
  );
}
