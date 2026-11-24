import React, { useMemo } from "react";
import { isNil } from "lodash-es";
import useCoreFellowshipLatestHeight from "next-common/hooks/fellowship/core/useCoreFellowshipLatestHeight";
import useCoreFellowshipBlockTime from "next-common/hooks/fellowship/core/useCoreFellowshipBlockTime";
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
import { cn } from "next-common/utils";

export function usePromotionPeriod({ lastPromotion, rank, params = {} }) {
  const latestHeight = useCoreFellowshipLatestHeight();
  return useMemo(() => {
    if (isNil(latestHeight)) {
      return null;
    }

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
  showTitle = true,
  className = "",
  titleClassName = "",
  progressClassName = "",
}) {
  const progress = usePromotionPeriod({ lastPromotion, rank, params });
  const blockTime = useCoreFellowshipBlockTime();

  if (isNil(progress?.promotionPeriod)) {
    return null;
  }

  const { percentageValue, remainingBlocks } = progress;

  const fgColor =
    percentageValue === 100 ? "var(--green500)" : "var(--neutral500)";

  return (
    <CoreFellowshipMemberInfoWrapper className={className}>
      {showTitle && (
        <CoreFellowshipMemberInfoTitle className={titleClassName}>
          Promotion Period
        </CoreFellowshipMemberInfoTitle>
      )}
      <Tooltip
        className="block"
        content={
          <Remaining
            blocks={remainingBlocks}
            percentage={percentageValue}
            blockTime={blockTime}
            dropInsignificant
          />
        }
      >
        <Progress
          className={cn("h-1", progressClassName)}
          percentage={percentageValue}
          bg="var(--neutral200)"
          fg={fgColor}
        />
      </Tooltip>
    </CoreFellowshipMemberInfoWrapper>
  );
}
