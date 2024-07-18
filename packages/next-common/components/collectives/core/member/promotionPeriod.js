import React, { useMemo } from "react";
import { isNil } from "lodash-es";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import Tooltip from "next-common/components/tooltip";
import Remaining from "next-common/components/remaining";
import Progress from "next-common/components/progress";

export function usePromotionPeriod({ lastPromotion, rank, params = {} }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const toRank = rank + 1;
  const index = toRank > 0 ? toRank - 1 : 0;
  const promotionPeriod = params.minPromotionPeriod[index];

  const gone = latestHeight - lastPromotion;
  const percentageValue = useMemo(() => {
    if (gone <= 0) {
      return 0;
    } else if (gone >= promotionPeriod) {
      return 100;
    }

    return Number((gone / promotionPeriod) * 100).toFixed(2);
  }, [promotionPeriod, gone]);

  const remainingBlocks = useMemo(() => {
    if (gone <= 0) {
      return promotionPeriod;
    } else if (gone >= promotionPeriod) {
      return 0;
    }

    return promotionPeriod - gone;
  }, [promotionPeriod, gone]);

  return {
    percentageValue,
    remainingBlocks,
    promotionPeriod,
  };
}

export default function CoreFellowshipMemberPromotionPeriod({
  lastPromotion,
  rank,
  params = {},
}) {
  const { percentageValue, remainingBlocks, promotionPeriod } =
    usePromotionPeriod({ lastPromotion, rank, params });

  if (isNil(promotionPeriod)) {
    return null;
  }

  return (
    <CoreFellowshipMemberInfoWrapper>
      <CoreFellowshipMemberInfoTitle>
        Promotion Period
      </CoreFellowshipMemberInfoTitle>
      <Tooltip
        className="block"
        content={
          <Remaining blocks={remainingBlocks} percentage={percentageValue} />
        }
      >
        <Progress
          className="h-1"
          percentage={percentageValue}
          bg="var(--theme100)"
          fg="var(--theme500)"
        />
      </Tooltip>
    </CoreFellowshipMemberInfoWrapper>
  );
}
