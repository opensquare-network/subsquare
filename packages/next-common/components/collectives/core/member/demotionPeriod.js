import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import React, { useMemo } from "react";
import { isNil } from "lodash-es";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberInfoTitle from "next-common/components/collectives/core/member/title";
import Tooltip from "next-common/components/tooltip";
import Remaining from "next-common/components/remaining";
import Progress from "next-common/components/progress";

export default function CoreFellowshipMemberDemotionPeriod({
  lastProof,
  rank,
  params,
}) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const demotionPeriod = useMemo(() => {
    return rank <= 0 ? params.offboardTimeout : params.demotionPeriod[rank - 1];
  }, [rank, params]);

  const gone = latestHeight - lastProof;
  const percentageValue = useMemo(() => {
    if (gone <= 0 || demotionPeriod <= 0) {
      return 0;
    } else if (gone >= demotionPeriod) {
      return 100;
    }

    return Number((gone / demotionPeriod) * 100).toFixed(2);
  }, [demotionPeriod, gone]);

  const remainingBlocks = useMemo(() => {
    if (gone <= 0) {
      return demotionPeriod;
    } else if (gone >= demotionPeriod) {
      return 0;
    }

    return demotionPeriod - gone;
  }, [demotionPeriod, gone]);

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
