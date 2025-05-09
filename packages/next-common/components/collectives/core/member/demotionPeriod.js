import { useMemo } from "react";
import { isNil } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";
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
import { useChainSettings } from "next-common/context/chain";
import { cn } from "next-common/utils";

const days20 = 20 * ONE_DAY;
const days30 = 30 * ONE_DAY;

export function getDemotionPeriodProgress({
  rank,
  lastProof,
  params,
  latestHeight,
}) {
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
}

export function useDemotionPeriod({ rank, lastProof, params }) {
  const latestHeight = useChainOrScanHeight();
  return useMemo(
    () => getDemotionPeriodProgress({ rank, lastProof, params, latestHeight }),
    [rank, lastProof, params, latestHeight],
  );
}

function _getProgressBarColor(
  rank,
  remainingBlocks,
  blockTime,
  demotionPeriod,
) {
  const halfPeriod = demotionPeriod / 2;
  const remainingTime = new BigNumber(blockTime).multipliedBy(remainingBlocks);
  const days = rank <= 0 ? days30 : days20;

  if (remainingBlocks >= halfPeriod) {
    return "var(--green500)";
  } else if (remainingTime.gt(days) && remainingBlocks < halfPeriod) {
    return "var(--orange500)";
  } else if (remainingTime.lte(days)) {
    return "var(--red500)";
  }
}

export default function CoreFellowshipMemberDemotionPeriod({
  lastProof,
  rank,
  params,
  showTitle = true,
  className = "",
  titleClassName = "",
  progressClassName = "",
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
      className={className}
      titleClassName={titleClassName}
      progressClassName={progressClassName}
    />
  );
}

function CoreFellowshipMemberDemotionPeriodImpl({
  percentageValue,
  remainingBlocks,
  demotionPeriod,
  showTitle,
  rank,
  className = "",
  titleClassName = "",
  progressClassName = "",
}) {
  const { blockTime } = useChainSettings();
  const fgColor = useMemo(() => {
    return _getProgressBarColor(
      rank,
      remainingBlocks,
      blockTime,
      demotionPeriod,
    );
  }, [rank, remainingBlocks, blockTime, demotionPeriod]);

  return (
    <CoreFellowshipMemberInfoWrapper className={className}>
      {showTitle && (
        <CoreFellowshipMemberInfoTitle className={titleClassName}>
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
          className={cn("h-1", progressClassName)}
          percentage={percentageValue}
          bg="var(--neutral200)"
          fg={fgColor}
        />
      </Tooltip>
    </CoreFellowshipMemberInfoWrapper>
  );
}
