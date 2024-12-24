import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { find } from "lodash-es";
import { CollectivesRetainTracks } from "next-common/components/fellowship/core/members/actions/approve/constants";
import useRelatedRetentionReferenda from "next-common/hooks/fellowship/useRelatedRetentionReferenda";

const ApproveFellowshipMemberPopup = dynamicPopup(() => import("./popup"));

export default function Approve({ member }) {
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const address = useRealAddress();
  const { address: memberAddress } = member;
  const { relatedReferenda } = useRelatedRetentionReferenda(memberAddress);

  const { members } = useFellowshipCoreMembers();
  const me = find(members, { address });

  if (member.rank <= 0) {
    // no approve action for candidates
    return null;
  }
  if (!CollectivesRetainTracks[member?.rank]) {
    // only show when we have the corresponding track
    return null;
  }

  const myRankOk = me && me.rank >= 3;
  const referendaNotCreated = relatedReferenda.length === 0;
  const canApprove = myRankOk && referendaNotCreated;

  let tooltipContent = "";
  if (!myRankOk) {
    tooltipContent = "Only available to the members with rank >= 3";
  } else if (!referendaNotCreated) {
    tooltipContent = `There are retention referenda for this member on going`;
  }

  if (!canApprove) {
    return (
      <Tooltip content={tooltipContent}>
        <span className="text14Medium text-textDisabled">Approve</span>
      </Tooltip>
    );
  }

  return (
    <>
      <span
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowApprovePopup(true)}
      >
        Approve
      </span>
      {showApprovePopup && (
        <ApproveFellowshipMemberPopup
          member={member}
          onClose={() => setShowApprovePopup(false)}
        />
      )}
    </>
  );
}
