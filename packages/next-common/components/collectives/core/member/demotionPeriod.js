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
import { useRemainingTime } from "next-common/components/remaining";

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

export default function CoreFellowshipMemberDemotionPeriod({
  lastProof,
  rank,
  params,
}) {
  const { percentageValue, remainingBlocks, demotionPeriod } =
    useDemotionPeriod({ rank, lastProof, params });

  if (isNil(demotionPeriod)) {
    return null;
  }

  const remainingTimeObj = useRemainingTime(remainingBlocks, true);

  // 进度条颜色
  let fgColor = "";
  if (remainingBlocks >= demotionPeriod / 2) {
    fgColor = "var(--green500)";
  } else if (
    remainingTimeObj &&
    remainingTimeObj.days >= 20 &&
    remainingBlocks < demotionPeriod / 2
  ) {
    fgColor = "var(--orange500)";
  } else if (remainingTimeObj && remainingTimeObj.days < 20) {
    fgColor = "var(--red500)";
  }

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
