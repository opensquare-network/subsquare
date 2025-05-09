import React, { useMemo } from "react";
import { isNil } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";
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
  const latestHeight = useChainOrScanHeight();
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
  showTitle = true,
  className = "",
  titleClassName = "",
  progressClassName = "",
}) {
  const { percentageValue, remainingBlocks, promotionPeriod } =
    usePromotionPeriod({ lastPromotion, rank, params });

  if (isNil(promotionPeriod)) {
    return null;
  }

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
          <Remaining blocks={remainingBlocks} percentage={percentageValue} />
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
