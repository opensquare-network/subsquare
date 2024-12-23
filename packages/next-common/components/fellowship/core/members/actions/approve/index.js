import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useMemo, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { find } from "lodash-es";
import { CollectivesRetainTracks } from "next-common/components/fellowship/core/members/actions/approve/constants";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useActiveReferenda } from "next-common/context/activeReferenda";

const ApproveFellowshipMemberPopup = dynamicPopup(() => import("./popup"));

export function useRelatedApprovalReferenda(address) {
  const pallet = useCoreFellowshipPallet();
  const activeReferenda = useActiveReferenda();
  return useMemo(() => {
    return activeReferenda.filter(({ call }) => {
      if (!call) {
        return false;
      }

      const { section, method } = call;
      if (section !== pallet) {
        return false;
      }
      if (!["approve"].includes(method)) {
        return false;
      }

      const nameArg = call.args.find(({ name }) => name === "who");
      return nameArg?.value === address;
    });
  }, [activeReferenda, address, pallet]);
}

export default function Approve({ member }) {
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const address = useRealAddress();
  const { address: memberAddress } = member;
  const relatedReferenda = useRelatedApprovalReferenda(memberAddress);

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
    tooltipContent = "Approval referenda is already exist";
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
