import RankField from "next-common/components/popup/fields/rankField";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import AdvanceSettings from "../common/advanceSettings";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import CreateFellowshipCoreMemberProposalSubmitButton from "./createFellowshipCoreMemberProposalSubmitButton";
import { find } from "lodash-es";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import Loading from "next-common/components/loading";
import useRelatedRetentionReferenda from "next-common/hooks/fellowship/useRelatedRetentionReferenda";
import { ReferendaWarningMessage } from "./common";

function NewFellowshipCoreMemberRetainReferendumInnerPopupImpl() {
  const { members } = useFellowshipCoreMembers();

  const { onClose } = usePopupParams();
  const { value: who, component: whoField } = useAddressComboField({
    title: "Who",
  });
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField();
  const targetMember = find(members, { address: who });

  const { relatedReferenda, isLoading } = useRelatedRetentionReferenda(who);
  const referendaAlreadyCreated = relatedReferenda.length > 0;

  const atRank = targetMember?.rank;

  const trackName = getRetainTrackNameFromRank(atRank);

  let warningMessage = null;

  if (isLoading) {
    warningMessage = (
      <div className="flex justify-center py-[12px]">
        <Loading size={20} />
      </div>
    );
  }

  if (referendaAlreadyCreated) {
    warningMessage = (
      <ReferendaWarningMessage
        referendumIndex={relatedReferenda[0].referendumIndex}
      />
    );
  }

  return (
    <Popup title="New Retain Proposal" onClose={onClose}>
      {whoField}
      <RankField title="At Rank" rank={atRank} readOnly />
      {warningMessage}
      <AdvanceSettings>{enactmentField}</AdvanceSettings>
      <div className="flex justify-end">
        <CreateFellowshipCoreMemberProposalSubmitButton
          disabled={isLoading || referendaAlreadyCreated}
          who={who}
          enactment={enactment}
          rank={atRank}
          action="approve"
          trackName={trackName}
        />
      </div>
    </Popup>
  );
}

export default function NewFellowshipCoreMemberRetainReferendumInnerPopup() {
  const pallet = useReferendaFellowshipPallet();
  return (
    <ActiveReferendaProvider pallet={pallet}>
      <NewFellowshipCoreMemberRetainReferendumInnerPopupImpl />
    </ActiveReferendaProvider>
  );
}
