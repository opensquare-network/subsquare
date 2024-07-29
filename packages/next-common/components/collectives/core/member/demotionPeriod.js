import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import Tooltip from "next-common/components/tooltip";
import Remaining from "next-common/components/remaining";
import Progress from "next-common/components/progress";

export function calculateDemotionPeriod({
  latestHeight,
  rank,
  lastProof,
  params,
}) {
  const demotionPeriod =
    rank <= 0 ? params.offboardTimeout : params.demotionPeriod[rank - 1];
  const gone = latestHeight - lastProof;

  let percentageValue;
  if (gone <= 0 || demotionPeriod <= 0) {
    percentageValue = 0;
  } else if (gone >= demotionPeriod) {
    percentageValue = 100;
  } else {
    percentageValue = Number((gone / demotionPeriod) * 100).toFixed(2);
  }

  let remainingBlocks;
  if (gone <= 0) {
    remainingBlocks = demotionPeriod;
  } else if (gone >= demotionPeriod) {
    remainingBlocks = 0;
  } else {
    remainingBlocks = demotionPeriod - gone;
  }

  return {
    percentageValue,
    remainingBlocks,
    demotionPeriod,
  };
}

export function useDemotionPeriod({ rank, lastProof, params }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  return useMemo(
    () => calculateDemotionPeriod({ latestHeight, rank, lastProof, params }),
    [rank, lastProof, params, latestHeight],
  );
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
