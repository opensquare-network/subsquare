import React, { useMemo } from "react";
import { isNil } from "lodash-es";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import Tooltip from "next-common/components/tooltip";
import Remaining from "next-common/components/remaining";
import Progress from "next-common/components/progress";
import {
  getGoneBlocksPercentage,
  getPromotionPeriod,
  getRemainingBlocks,
} from "next-common/utils/collective/demotionAndPromotion";

export function usePromotionPeriod({ lastPromotion, rank, params = {} }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  return useMemo(() => {
    const promotionPeriod = getPromotionPeriod(rank, params);
    const gone = latestHeight - lastPromotion;
    const percentageValue = getGoneBlocksPercentage(gone, promotionPeriod);
    const remainingBlocks = getRemainingBlocks(gone, promotionPeriod);

    return {
      percentageValue,
      remainingBlocks,
      promotionPeriod,
    };
  }, [lastPromotion, rank, params, latestHeight]);
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
