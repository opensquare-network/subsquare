import React, { useMemo } from "react";
import { isNil } from "lodash-es";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import Tooltip from "next-common/components/tooltip";
import Remaining from "next-common/components/remaining";
import Progress from "next-common/components/progress";
import {
  getDemotionPeriod,
  getGoneBlocksPercentage,
  getRemainingBlocks,
} from "next-common/utils/collective/demotionAndPromotion";
import { ONE_DAY } from "next-common/utils/constants";
import BigNumber from "bignumber.js";

const days20 = 20 * ONE_DAY;

export function useDemotionPeriod({ rank, lastProof, params }) {
  const latestHeight = useBlockHeight();
  return useMemo(() => {
    const demotionPeriod = getDemotionPeriod(rank, params);
    if (demotionPeriod <= 0) {
      return {
        percentageValue: 0,
        remainingBlocks: null,
        demotionPeriod,
      };
    }

    const gone = latestHeight - lastProof;
    const percentageValue = getGoneBlocksPercentage(gone, demotionPeriod);
    const remainingBlocks = getRemainingBlocks(gone, demotionPeriod);

    return {
      percentageValue,
      remainingBlocks,
      demotionPeriod,
    };
  }, [rank, lastProof, params, latestHeight]);
}

function _getProgressBarColor(remainingBlocks, blockTime, demotionPeriod) {
  const halfPeriod = demotionPeriod / 2;
  const remainingTime = new BigNumber(blockTime).multipliedBy(remainingBlocks);
  if (remainingBlocks >= halfPeriod) {
    return "var(--green500)";
  } else if (remainingTime.gt(days20) && remainingBlocks < halfPeriod) {
    return "var(--orange500)";
  } else if (remainingTime.lte(days20)) {
    return "var(--red500)";
  }
}

export default function CoreFellowshipMemberDemotionPeriod({
  lastProof,
  rank,
  params,
  showTitle = true,
}) {
  const { percentageValue, remainingBlocks, demotionPeriod } =
    useDemotionPeriod({ rank, lastProof, params });

  if (isNil(demotionPeriod)) {
    return null;
  }

  return (
    <CoreFellowshipMemberDemotionPeriodImpl
      percentageValue={percentageValue}
      remainingBlocks={remainingBlocks}
      demotionPeriod={demotionPeriod}
      showTitle={showTitle}
      rank={rank}
    />
  );
}

function CoreFellowshipMemberDemotionPeriodImpl({
  percentageValue,
  remainingBlocks,
  demotionPeriod,
  showTitle,
  rank,
}) {
  const fgColor = useMemo(() => {
    return _getProgressBarColor(
      remainingBlocks,
      remainingBlocks,
      demotionPeriod,
    );
  }, [remainingBlocks, demotionPeriod]);

  return (
    <CoreFellowshipMemberInfoWrapper>
      {showTitle && (
        <CoreFellowshipMemberInfoTitle>
          {rank <= 0 ? "Offboard Timeout" : "Demotion Period"}
        </CoreFellowshipMemberInfoTitle>
      )}
      <Tooltip
        className="block"
        content={
          remainingBlocks > 0 && (
            <Remaining blocks={remainingBlocks} percentage={percentageValue} />
          )
        }
      >
        <Progress
          className="h-1"
          percentage={percentageValue}
          bg="var(--neutral200)"
          fg={fgColor}
        />
      </Tooltip>
    </CoreFellowshipMemberInfoWrapper>
  );
}
