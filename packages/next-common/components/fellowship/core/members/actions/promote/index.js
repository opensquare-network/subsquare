import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { usePageProps } from "next-common/context/page";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { find } from "lodash-es";
import { CollectivesPromoteTracks } from "next-common/components/fellowship/core/members/actions/promote/constants";
import useRelatedPromotionReferenda from "next-common/hooks/fellowship/useRelatedPromotionReferenda";
import { useEstimateBlocksTime } from "next-common/utils/hooks";

const PromoteFellowshipMemberPopup = dynamicPopup(() => import("./popup"));

export default function Promote({ member }) {
  const [showPromotePopup, setShowPromotePopup] = useState(false);
  const address = useRealAddress();
  const {
    rank,
    status: { lastPromotion } = {},
    address: memberAddress,
  } = member;
  const { relatedReferenda } = useRelatedPromotionReferenda(memberAddress);

  const { members } = useFellowshipCoreMembers();

  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { fellowshipParams } = usePageProps();

  if (rank >= 6) {
    return;
  }
  if (!CollectivesPromoteTracks[member?.rank + 1]) {
    // only show when we have the corresponding track
    return null;
  }

  const me = find(members, { address });
  const myRankOk = me && me.rank >= 3;

  const toRank = rank + 1;
  const index = rankToIndex(toRank);
  const promotionPeriod = fellowshipParams.minPromotionPeriod[index];
  const gone = latestHeight - lastPromotion;
  const promotionPeriodComplete = gone >= promotionPeriod;
  const isReferendaExisted = relatedReferenda.length === 0;
  const canPromote = promotionPeriodComplete && myRankOk && isReferendaExisted;
  const estimatedTime = useEstimateBlocksTime(promotionPeriod - gone);

  let tipContent = "";
  if (!myRankOk) {
    tipContent = "Only available to the members with rank >= 3";
  } else if (!promotionPeriodComplete) {
    tipContent = `Promotion period is not reached`;
    if (estimatedTime) {
      tipContent = `${tipContent}, ${estimatedTime} remaining`;
    }
  } else if (!isReferendaExisted) {
    tipContent = `There are promotion referenda for this member on going`;
  }

  if (!canPromote) {
    return (
      <Tooltip content={tipContent}>
        <span className="text14Medium text-textDisabled">Promote</span>
      </Tooltip>
    );
  }

  return (
    <>
      <span
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowPromotePopup(true)}
      >
        Promote
      </span>
      {showPromotePopup && (
        <PromoteFellowshipMemberPopup
          member={member}
          onClose={() => setShowPromotePopup(false)}
        />
      )}
    </>
  );
}
