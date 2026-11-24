import useCoreFellowshipLatestHeight from "next-common/hooks/fellowship/core/useCoreFellowshipLatestHeight";
import useCoreFellowshipBlockTime from "next-common/hooks/fellowship/core/useCoreFellowshipBlockTime";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { find, isNil, noop } from "lodash-es";
import { CollectivesPromoteTracks } from "next-common/components/fellowship/core/members/actions/promote/constants";
import useRelatedPromotionReferenda from "next-common/hooks/fellowship/useRelatedPromotionReferenda";
import { estimateBlocksTime } from "next-common/utils";

const PromoteFellowshipMemberPopup = dynamicPopup(() => import("./popup"));

export function useShouldShowPromoteButton(member) {
  const { rank } = member;

  if (rank >= 6) {
    return false;
  }

  if (!CollectivesPromoteTracks[rank + 1]) {
    // only show when we have the corresponding track
    return false;
  }

  return true;
}

export function useCanPromote(member, params) {
  const address = useRealAddress();
  const {
    rank,
    status: { lastPromotion } = {},
    address: memberAddress,
  } = member;
  const { relatedReferenda } = useRelatedPromotionReferenda(memberAddress);

  const { members = [] } = useFellowshipCollectiveMembers();

  const latestHeight = useCoreFellowshipLatestHeight();
  const blockTime = useCoreFellowshipBlockTime();

  if (isNil(latestHeight)) {
    return null;
  }

  const me = find(members, { address });
  const myRankOk = me && me.rank >= 3;

  const toRank = rank + 1;
  const index = rankToIndex(toRank);
  const promotionPeriod = params.minPromotionPeriod[index];
  const gone = latestHeight - lastPromotion;
  const promotionPeriodComplete = gone >= promotionPeriod;
  const isReferendaExisted = relatedReferenda.length === 0;
  const canPromote = promotionPeriodComplete && myRankOk && isReferendaExisted;
  const estimatedTime = estimateBlocksTime(promotionPeriod - gone, blockTime, {
    dropInsignificant: true,
  });

  let reason = "";
  if (!myRankOk) {
    reason = "Only available to the members with rank >= 3";
  } else if (!promotionPeriodComplete) {
    reason = "Promotion period is not reached";
    if (estimatedTime) {
      reason = `${reason}, ${estimatedTime} remaining`;
    }
  } else if (!isReferendaExisted) {
    reason = "There are promotion referenda for this member on going";
  }

  return { canPromote, reason };
}

export function CoreFellowshipPromoteButton({
  member,
  params,
  onClick = noop,
}) {
  const eligibility = useCanPromote(member, params);
  if (!eligibility) {
    return null;
  }

  const { canPromote, reason } = eligibility;
  if (!canPromote) {
    return (
      <Tooltip content={reason}>
        <span className="text14Medium text-textDisabled">Promote</span>
      </Tooltip>
    );
  }

  return (
    <span
      className="text14Medium text-theme500 cursor-pointer"
      onClick={onClick}
    >
      Promote
    </span>
  );
}

export default function CoreFellowshipPromote({ member, params }) {
  const [showPromotePopup, setShowPromotePopup] = useState(false);
  const shouldShowButton = useShouldShowPromoteButton(member);
  if (!shouldShowButton) {
    return null;
  }

  return (
    <>
      <CoreFellowshipPromoteButton
        member={member}
        params={params}
        onClick={() => setShowPromotePopup(true)}
      />
      {showPromotePopup && (
        <PromoteFellowshipMemberPopup
          member={member}
          onClose={() => setShowPromotePopup(false)}
        />
      )}
    </>
  );
}
