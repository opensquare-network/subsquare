import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { usePageProps } from "next-common/context/page";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import PromoteFellowshipMemberPopup from "./popup";

export default function Promote({ member }) {
  const [showPromotePopup, setShowPromotePopup] = useState(false);
  const address = useRealAddress();
  const { rank, status: { lastPromotion } = {} } = member;

  const members = useSelector(fellowshipCoreMembersSelector);

  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { fellowshipParams } = usePageProps();

  const isMaxRank = rank >= 6;

  if (isMaxRank) {
    return;
  }

  const me = members.find((m) => m.address === address);
  const myRankOk = me && me.rank >= 3;

  const index = rank > 0 ? rank - 1 : 0;
  const promotionPeriod = fellowshipParams.minPromotionPeriod[index];
  const gone = latestHeight - lastPromotion;
  const promotionPeriodComplete = gone >= promotionPeriod;
  const canPromote = promotionPeriodComplete && myRankOk;
  if (!canPromote) {
    let tipContent = "";

    if (!myRankOk) {
      tipContent = "Only available to the members with rank >= 3";
    } else if (!promotionPeriodComplete) {
      tipContent = `Available after ${promotionPeriod - gone} blocks`;
    }

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
