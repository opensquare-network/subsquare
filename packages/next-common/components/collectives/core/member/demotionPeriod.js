import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
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
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";

const days20 = 20 * ONE_DAY;

export function useDemotionPeriod({ rank, lastProof, params }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
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
}) {
  const { percentageValue, remainingBlocks, demotionPeriod } =
    useDemotionPeriod({ rank, lastProof, params });
  const blockTime = useSelector(blockTimeSelector);

  if (isNil(demotionPeriod)) {
    return null;
  }

  const fgColor = useMemo(() => {
    return _getProgressBarColor(remainingBlocks, remainingBlocks, demotionPeriod);
  }, [blockTime, remainingBlocks, demotionPeriod]);

  return (
    <CoreFellowshipMemberInfoWrapper>
      <CoreFellowshipMemberInfoTitle>
        {rank <= 0 ? "Offboard Timeout" : "Demotion Period"}
      </CoreFellowshipMemberInfoTitle>
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
