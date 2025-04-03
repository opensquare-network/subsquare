import { useMemo } from "react";
import RankField from "next-common/components/popup/fields/rankField";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useFellowshipMemberFiled from "next-common/components/preImages/createPreimagePopup/fields/useFellowshipMemberFiled";
import AdvanceSettings from "../common/advanceSettings";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import CreateFellowshipCoreMemberProposalSubmitButton from "./createFellowshipCoreMemberProposalSubmitButton";
import { getPromoteTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import useRelatedPromotionReferenda from "next-common/hooks/fellowship/useRelatedPromotionReferenda";
import { ReferendaWarningMessage, ReferendaActionMessage } from "./common";
import ErrorInfoPanel from "next-common/components/summary/styled/errorInfoPanel";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { find } from "lodash-es";
import { CollectivesPromoteTracks } from "next-common/components/fellowship/core/members/actions/promote/constants";
import { isNil } from "lodash-es";
import { rankToPromoteTrack } from "next-common/utils/fellowship/rankToTrack";
import { useFellowshipTrackDecisionDeposit } from "next-common/hooks/fellowship/useFellowshipTrackDecisionDeposit";
import { useReferendaOptionsField } from "next-common/components/preImages/createPreimagePopup/fields/useReferendaOptionsField";

export function NotAvailableMemberPrompt() {
  return (
    <ErrorInfoPanel className="">
      The address currently filled is not a fellowship member
    </ErrorInfoPanel>
  );
}

function NewFellowshipCoreMemberPromoteReferendumInnerPopupImpl() {
  const { members, loading } = useFellowshipCoreMembers();
  const filteredMembers = useMemo(() => {
    if (loading || !members) {
      return [];
    }

    return members
      .filter((member) => CollectivesPromoteTracks[member.rank + 1])
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
  const toRank = !isNil(targetMember?.rank) ? targetMember?.rank + 1 : "";

  const trackName = getPromoteTrackNameFromRank(toRank);

  const { relatedReferenda, isLoading } = useRelatedPromotionReferenda(who);
  const isReferendaExisted = relatedReferenda.length > 0;

  const decisionDeposit = useFellowshipTrackDecisionDeposit(
    rankToPromoteTrack(toRank),
  );
  const { value: referendaOptions, component: referendaOptionsField } =
    useReferendaOptionsField(decisionDeposit);

  return (
    <Popup title="New Promote Proposal" onClose={onClose}>
      {whoField}
      <RankField title="To Rank" rank={toRank} readOnly />
      <ReferendaActionMessage
        rank={toRank}
        who={who}
        trackName={trackName}
        action="promote"
      />
      <ReferendaWarningMessage
        isLoading={isLoading}
        relatedReferenda={relatedReferenda}
      />
      {!isAvailableMember && <NotAvailableMemberPrompt />}
      {!!who && !!toRank && referendaOptionsField}
      <AdvanceSettings>{enactmentField}</AdvanceSettings>
      <div className="flex justify-end">
        <CreateFellowshipCoreMemberProposalSubmitButton
          disabled={isLoading || isReferendaExisted || !isAvailableMember}
          tooltip
          who={who}
          enactment={enactment}
          rank={toRank}
          action="promote"
          trackName={trackName}
          checkDecisionDeposit={referendaOptions.checkDecisionDeposit}
          checkVoteAye={referendaOptions.checkVoteAye}
        />
      </div>
    </Popup>
  );
}

export default function NewFellowshipCoreMemberPromoteReferendumInnerPopup() {
  const pallet = useReferendaFellowshipPallet();
  return (
    <ActiveReferendaProvider pallet={pallet}>
      <NewFellowshipCoreMemberPromoteReferendumInnerPopupImpl />
    </ActiveReferendaProvider>
  );
}
