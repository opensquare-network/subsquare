import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { find } from "lodash-es";
import { CollectivesRetainTracks } from "next-common/components/fellowship/core/members/actions/approve/constants";
import useRelatedRetentionReferenda from "next-common/hooks/fellowship/useRelatedRetentionReferenda";

const ApproveFellowshipMemberPopup = dynamicPopup(() => import("./popup"));

export function useShouldShowApproveButton(member) {
  if (member.rank <= 0) {
    // no approve action for candidates
    return false;
  }
  if (!CollectivesRetainTracks[member?.rank]) {
    // only show when we have the corresponding track
    return false;
  }
  return true;
}

export function useCanApprove(member) {
  const address = useRealAddress();
  const { address: memberAddress } = member;
  const { relatedReferenda } = useRelatedRetentionReferenda(memberAddress);

  const { members } = useFellowshipCoreMembersWithRank();
  const me = find(members, { address });

  const myRankOk = me && me.rank >= 3;
  const referendaNotCreated = relatedReferenda.length === 0;
  const canApprove = myRankOk && referendaNotCreated;

  let reason = "";
  if (!myRankOk) {
    reason = "Only available to the members with rank >= 3";
  } else if (!referendaNotCreated) {
    reason = "There are retention referenda for this member on going";
  }

  return {
    canApprove,
    reason,
  };
}

export function CoreFellowshipApproveButton({ member, onClick }) {
  const { canApprove, reason } = useCanApprove(member);

  if (!canApprove) {
    return (
      <Tooltip content={reason}>
        <span className="text14Medium text-textDisabled">Approve</span>
      </Tooltip>
    );
  }

  return (
    <span
      className="text14Medium text-theme500 cursor-pointer"
      onClick={onClick}
    >
      Approve
    </span>
  );
}

export default function CoreFellowshipApprove({ member }) {
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const shouldShowButton = useShouldShowApproveButton(member);
  if (!shouldShowButton) {
    return null;
  }

  return (
    <>
      <CoreFellowshipApproveButton
        member={member}
        onClick={() => setShowApprovePopup(true)}
      />
      {showApprovePopup && (
        <ApproveFellowshipMemberPopup
          member={member}
          onClose={() => setShowApprovePopup(false)}
        />
      )}
    </>
  );
}
