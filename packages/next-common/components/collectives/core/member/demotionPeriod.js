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

export function useDemotionPeriod({ rank, lastProof, params }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  return useMemo(() => {
    const demotionPeriod = getDemotionPeriod(rank, params);
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
          bg="var(--theme100)"
          fg="var(--theme500)"
        />
      </Tooltip>
    </CoreFellowshipMemberInfoWrapper>
  );
}
