import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { usePageProps } from "next-common/context/page";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useMemo, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { find } from "lodash-es";
import { CollectivesPromoteTracks } from "next-common/components/fellowship/core/members/actions/promote/constants";
import { useActiveReferenda } from "next-common/context/activeReferenda";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

const PromoteFellowshipMemberPopup = dynamicPopup(() => import("./popup"));

export function useRelatedPromotionReferenda(address) {
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
      if (!["promote", "promoteFast"].includes(method)) {
        return false;
      }

      const nameArg = call.args.find(({ name }) => name === "who");
      return nameArg?.value === address;
    });
  }, [activeReferenda, address, pallet]);
}

export default function Promote({ member }) {
  const [showPromotePopup, setShowPromotePopup] = useState(false);
  const address = useRealAddress();
  const {
    rank,
    status: { lastPromotion } = {},
    address: memberAddress,
  } = member;
  const relatedReferenda = useRelatedPromotionReferenda(memberAddress);

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

  const index = rankToIndex(rank);
  const promotionPeriod = fellowshipParams.minPromotionPeriod[index];
  const gone = latestHeight - lastPromotion;
  const promotionPeriodComplete = gone >= promotionPeriod;
  const referendaNotCreated = relatedReferenda.length === 0;

  const canPromote = promotionPeriodComplete && myRankOk && referendaNotCreated;

  let tipContent = "";

  if (!myRankOk) {
    tipContent = "Only available to the members with rank >= 3";
  } else if (!promotionPeriodComplete) {
    tipContent = `Available after ${promotionPeriod - gone} blocks`;
  } else if (!referendaNotCreated) {
    tipContent = `Referendum #${relatedReferenda[0].referendumIndex} is currently in progress`;
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
