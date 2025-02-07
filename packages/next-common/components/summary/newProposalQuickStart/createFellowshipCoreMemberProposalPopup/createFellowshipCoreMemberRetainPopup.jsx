import { useMemo } from "react";
import RankField from "next-common/components/popup/fields/rankField";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useFellowshipMemberFiled from "next-common/components/preImages/createPreimagePopup/fields/useFellowshipMemberFiled";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import AdvanceSettings from "../common/advanceSettings";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import CreateFellowshipCoreMemberProposalSubmitButton from "./createFellowshipCoreMemberProposalSubmitButton";
import { find } from "lodash-es";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import useRelatedRetentionReferenda from "next-common/hooks/fellowship/useRelatedRetentionReferenda";
import { ReferendaActionMessage, ReferendaWarningMessage } from "./common";
import { NotAvailableMemberPrompt } from "./createFellowshipCoreMemberPromotePopup";
import { CollectivesRetainTracks } from "next-common/components/fellowship/core/members/actions/approve/constants";
import { useFellowshipTrackDecisionDeposit } from "next-common/hooks/fellowship/useFellowshipTrackDecisionDeposit";
import { rankToRetainTrack } from "next-common/utils/fellowship/rankToTrack";
import { useReferendaOptionsField } from "next-common/components/preImages/createPreimagePopup/fields/useReferendaOptionsField";

function NewFellowshipCoreMemberRetainReferendumInnerPopupImpl() {
  const { members, loading } = useFellowshipCoreMembers();
  const filteredMembers = useMemo(() => {
    if (loading || !members) {
      return [];
    }

    return members
      .filter((member) => CollectivesRetainTracks[member.rank])
      .sort((a, b) => b.rank - a.rank);
  }, [members, loading]);

  const { onClose } = usePopupParams();
  const {
    value: who,
    isAvailableMember,
    component: whoField,
  } = useFellowshipMemberFiled({
    title: "Who",
    members: filteredMembers,
    loading,
  });
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField();
  const targetMember = find(members, { address: who });

  const { relatedReferenda, isLoading } = useRelatedRetentionReferenda(who);
  const isReferendaExisted = relatedReferenda.length > 0;

  const atRank = targetMember?.rank;

  const trackName = getRetainTrackNameFromRank(atRank);

  const decisionDeposit = useFellowshipTrackDecisionDeposit(
    rankToRetainTrack(atRank),
  );
  const { value: referendaOptions, component: referendaOptionsField } =
    useReferendaOptionsField(decisionDeposit);

  return (
    <Popup title="New Retain Proposal" onClose={onClose}>
      {whoField}
      <RankField title="At Rank" rank={atRank} readOnly />
      <ReferendaActionMessage
        rank={atRank}
        who={who}
        trackName={trackName}
        action="approve"
      />
      <ReferendaWarningMessage
        isLoading={isLoading}
        relatedReferenda={relatedReferenda}
      />
      {!isAvailableMember && <NotAvailableMemberPrompt />}
      {!!who && !!atRank && referendaOptionsField}
      <AdvanceSettings>{enactmentField}</AdvanceSettings>
      <div className="flex justify-end">
        <CreateFellowshipCoreMemberProposalSubmitButton
          disabled={isLoading || isReferendaExisted || !isAvailableMember}
          who={who}
          enactment={enactment}
          rank={atRank}
          action="approve"
          trackName={trackName}
          checkDecisionDeposit={referendaOptions.checkDecisionDeposit}
          checkVoteAye={referendaOptions.checkVoteAye}
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
